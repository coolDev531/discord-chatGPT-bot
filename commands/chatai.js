const createS3 = require('../utils/createS3');
const createTextFile = require('../utils/createTextFile');
const { handleError } = require('../utils/errorHandler');
const { OPENAI_MODEL } = require('../utils/constants');
const s3 = createS3();
const axios = require('axios');

const execute = async (message, openai, prompt) => {
  const thinkingMessage = await message.reply("One moment, I'm thinking...");

  try {
    const txtFile = [...message.attachments.values()][0];

    // if attaching a text file, concat that to the prompt
    if (txtFile) {
      const response = await axios({
        method: 'get',
        url: txtFile.url,
        responseType: 'plain/text',
      });

      prompt += ` ${response.data}`;
    }

    const completion = await openai.createChatCompletion({
      model: OPENAI_MODEL,
      temperature: 1,
      max_tokens: 2049,
      messages: [
        {
          role: 'system',
          content: global.systemContent,
        },
        ...global.messages,
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const text = completion.data.choices[0].message.content;

    global.messages.push({
      role: 'assistant',
      content: text,
    });

    // if longer than 2000 characters make txt file and upload to s3
    if (text.length > 2000 || txtFile) {
      await splitAndSend(text, message, prompt);
      thinkingMessage.delete();

      return;
    }

    thinkingMessage.delete();

    global.messages.push({
      role: 'user',
      content: prompt,
    });

    return await message.reply(text); // MUST USE AWAIT HERE
  } catch (error) {
    console.log({ error });
    const error1 = error?.response?.data?.error?.message;
    const error2 = error?.rawError?.message;

    return handleError(message, (error1 || error2) ?? 'ERROR');
  }
};

const splitAndSend = async (text, message, prompt) => {
  // let chunks = text.match(/.{1,2000}/g); // chunks of 2000 each
  // for await (const chunk of chunks) {
  //   if (!chunk) continue;
  //   await message.channel.send(chunk);
  // }
  const MAX_LENGTH = 2000;

  const chunks = [];

  for (let i = 0; i < text.length; i += MAX_LENGTH) {
    const chunk = text.slice(i, i + MAX_LENGTH);
    chunks.push(chunk);
  }

  for await (const chunk of chunks) {
    if (!chunk) continue;
    await message.channel.send(chunk);
  }

  const { data, key } = await createTextFile(s3, message, text);

  await message.reply({
    files: [{ attachment: data.Location, name: `${prompt}.txt` }],
  });

  await s3
    .deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    })
    .promise();
};

module.exports = {
  name: 'chat',
  description: "Generate a response using OpenAI's API",
  execute,
};
