const axios = require('axios');
const createS3 = require('../utils/createS3');
const createTextFile = require('../utils/createTextFile');
const { handleError } = require('../utils/errorHandler');
const { OPENAI_MODEL } = require('../utils/constants');
require('dotenv').config();

const s3 = createS3();

const execute = async (message, openai, prompt) => {
  const thinkingMsg = await message.reply("One moment, I'm thinking...");

  try {
    const txtFile = [...message.attachments.values()][0];

    if (!prompt) {
      return handleError(message, 'Please provide a prompt');
    }

    if (txtFile && txtFile.name.length > 100) {
      return handleError(
        message,
        'File name must be less than 100 characters.'
      );
    }

    let response;

    if (txtFile?.url) {
      // if attaching a text file, concat that to the prompt
      response = await axios({
        method: 'get',
        url: txtFile?.url,
        responseType: 'plain/text',
      });
    }

    const completion = await openai.createChatCompletion({
      model: OPENAI_MODEL,
      temperature: 1,
      max_tokens: 2049,
      messages: [
        {
          role: 'system',
          content:
            'You are an AI assistant, you are helping the user with their code.',
        },
        ...global.messages,
        {
          role: 'user',
          content: `${prompt}:\n ${response?.data}`,
        },
      ],
    });

    const text = completion.data.choices[0].message.content;

    const { data, key } = await createTextFile(s3, message, text);

    const txtFileName = prompt.substr(0, 100);

    message.reply({
      files: [{ attachment: data.Location, name: `${txtFileName}.txt` }],
    });

    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
      .promise();

    thinkingMsg.delete();

    return;
  } catch (error) {
    const error1 = error?.response?.data?.error?.message;
    const error2 = error?.rawError?.message;

    return handleError(message, error1 || error2 || JSON.stringify(error));
  }
};

module.exports = {
  name: 'code',
  description: "Generate a text file using OpenAI's API",
  execute,
};
