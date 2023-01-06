const buildEmbed = require('../utils/buildEmbed');
const createAndResizeImage = require('../utils/createAndResizeImage');
const createS3 = require('../utils/createS3');
const { handleError } = require('../utils/errorHandler');
require('dotenv').config();

const s3 = createS3();

module.exports = async (message, openai, prompt) => {
  try {
    if ([...message.attachments.values()].length < 2) {
      return handleError(
        message,
        'Please attach two images to your message., first image is the base image, second image is the mask (transparent png)'
      );
    }

    const initialMsg = await message.reply(
      'one moment, updating your image...'
    );
    const toBeConverted1 = [...message.attachments.values()][0];
    const toBeConverted2 = [...message.attachments.values()][1];

    const resized1 = await createAndResizeImage(message, s3, toBeConverted1);
    const resized2 = await createAndResizeImage(message, s3, toBeConverted2);

    imageResp = await openai.createImageEdit(
      resized1,
      resized2,
      prompt,
      1,
      '1024x1024'
    );

    const imageUrl = imageResp.data.data[0].url;
    const embed = buildEmbed(imageUrl);
    await message.reply({ embeds: [embed] });
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
