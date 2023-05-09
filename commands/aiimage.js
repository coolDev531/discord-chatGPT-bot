const buildEmbed = require('../utils/buildEmbed');
const { handleError } = require('../utils/errorHandler');

const execute = async (message, openai, prompt) => {
  try {
    const initialMsg = await message.reply('one moment, crafting an image...');

    const imageResp = await openai.createImage({
      prompt,
      n: 1,
      size: '1024x1024',
    });
    const imageUrl = imageResp.data.data[0].url;
    const embed = buildEmbed(imageUrl);
    initialMsg.delete();
    return message.reply({ embeds: [embed] });
  } catch (error) {
    console.log(error.response.data.error.message);
    return handleError(message, error.response.data.error.message);
  }
};

module.exports = {
  name: 'image',
  description: "Generate an image using OpenAI's API",
  execute,
};
