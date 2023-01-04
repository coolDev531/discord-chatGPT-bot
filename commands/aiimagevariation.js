require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
const fsPromise = require('fs/promises');
const buildEmbed = require('../utils/buildEmbed');
const { handleError } = require('../utils/errorHandler');
const createS3 = require('../utils/createS3');

const s3 = createS3();

module.exports = async (message, openai) => {
  try {
    message.reply('one moment, crafting an image...');
    const toBeConverted = [...message.attachments.values()][0];

    const response = await axios({
      method: 'get',
      url: toBeConverted.url,
      responseType: 'stream',
    });

    const fileName = `${toBeConverted.id + Date.now()}`;

    const key = `${fileName}.png`;

    try {
      // Upload file to the S3 bucket
      await s3
        .upload({
          Body: response.data,
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          ACL: 'public-read',
          ContentType: 'image/png',
        })
        .promise();
    } catch (err) {
      console.log('Error occurred while trying to upload the file to S3', err);

      return handleError(
        message,
        'Error occurred while trying to upload the file to S3'
      );
    }

    let originalImage;

    try {
      originalImage = await s3
        .getObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
        })
        .promise();
    } catch (error) {
      console.log('error getting image from S3', error);
      return handleError(message, 'error getting image from S3');
    }

    const resizedImageBuffer = await sharp(
      Buffer.from(originalImage.Body, 'utf-8')
    )
      .resize({
        width: 1024,
        height: 1024,
      })
      .toFormat('png');

    // Delete the file from the S3 bucket
    await s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
      .promise();

    resizedImageBuffer.name = toBeConverted.name || 'image'; // set the name of the buffer to the name of the file

    const imageResp = await openai.createImageVariation(
      resizedImageBuffer,
      1,
      '1024x1024'
    );

    const imageUrl = imageResp.data.data[0].url;
    const embed = buildEmbed(imageUrl);
    message.reply({ embeds: [embed] });

    return;
  } catch (error) {
    console.log(error?.response?.data?.error?.message || error);
    return handleError(
      message,
      error?.response?.data?.error?.message || JSON.stringify(error)
    );
  }
};
