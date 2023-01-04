const axios = require('axios');
const fs = require('fs');
const sharp = require('sharp');
const fsPromise = require('fs/promises');
const buildEmbed = require('../utils/buildEmbed');
const path = require('path');
const { handleError } = require('../utils/errorHandler');

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

    response.data.pipe(
      fs.createWriteStream(path.resolve(__dirname, `../files/${fileName}.png`))
    );

    return response.data.on('end', async () => {
      const originalImage = path.resolve(__dirname, `../files/${fileName}.png`);
      await sharp(originalImage)
        .resize({
          width: 1024,
          height: 1024,
        })
        .toFile(path.resolve(__dirname, `../files/${fileName}-resized.png`));

      const buffer = await fsPromise.readFile(
        path.resolve(__dirname, `../files/${fileName}-resized.png`)
      );

      buffer.name = toBeConverted.name || 'image'; // set the name of the buffer to the name of the file

      const imageResp = await openai.createImageVariation(
        buffer,
        1,
        '1024x1024'
      );
      const imageUrl = imageResp.data.data[0].url;
      const embed = buildEmbed(imageUrl);
      message.reply({ embeds: [embed] });
      await fsPromise.unlink(
        path.resolve(__dirname, `../files/${fileName}.png`)
      ); // delete the file when done
      await fsPromise.unlink(
        path.resolve(__dirname, `../files/${fileName}-resized.png`)
      ); // delete the file when done
      return;
    });
  } catch (error) {
    console.log(error.response.data.error.message);
    return handleError(message, error.response.data.error.message);
  }
};
