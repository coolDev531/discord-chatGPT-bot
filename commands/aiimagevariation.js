require('dotenv').config();
const buildEmbed = require('../utils/buildEmbed');
const { handleError } = require('../utils/errorHandler');
const createS3 = require('../utils/createS3');
const createAndResizeImage = require('../utils/createAndResizeImage');

const s3 = createS3();

const execute = async (message, openai) => {
  try {
    const toBeConverted = [...message.attachments.values()][0];

    const initialMsg = await message.reply('one moment, crafting an image...');

    const resizedImageBuffer = await createAndResizeImage(
      message,
      s3,
      toBeConverted
    );

    const imageResp = await openai.createImageVariation(
      resizedImageBuffer,
      1,
      '1024x1024'
    );

    const imageUrl = imageResp.data.data[0].url;
    const embed = buildEmbed(imageUrl);
    message.reply({ embeds: [embed] });
    initialMsg.delete();
    return;
  } catch (error) {
    console.log(error?.response?.data?.error?.message || error);
    return handleError(
      message,
      error?.response?.data?.error?.message || JSON.stringify(error)
    );
  }
};

module.exports = {
  name: 'aiimagevariation',
  description: "Generate an image variation using OpenAI's API",
  execute,
};
