const AWS = require('aws-sdk');
require('dotenv').config();

const createS3 = () => {
  const s3 = new AWS.S3({
    Bucket: process.env.S3_BUCKET_NAME,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  });

  return s3;
};

module.exports = createS3;
