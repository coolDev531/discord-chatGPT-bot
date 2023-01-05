const createS3 = require('./createS3');
require('dotenv').config();

module.exports = async (s3 = createS3(), message, text) => {
  const fileName = `${message.author.id}_${Date.now()}`;
  const key = `${fileName}.txt`;

  // Upload file to the S3 bucket
  const data = await s3
    .upload({
      Body: text,
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ACL: 'public-read',
      ContentType: 'text/plain',
    })
    .promise();

  // message.reply({
  //   files: [{ attachment: data.Location, name: `${prompt}.txt` }],
  // });

  return { data, key };
};
