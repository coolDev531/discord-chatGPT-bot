const axios = require('axios');
const sharp = require('sharp');
require('dotenv').config();

module.exports = async (message, s3) => {
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

  const resizedImageBuffer = await sharp(originalImage.Body)
    .resize({
      width: 1024,
      height: 1024,
    })
    .toFormat('png');

  resizedImageBuffer.name = toBeConverted.name || 'image'; // set the name of the buffer to the name of the file

  // Delete the file from the S3 bucket
  await s3
    .deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    })
    .promise();

  return resizedImageBuffer;
};
