const buildEmbed = require('../utils/buildEmbed');

module.exports = async (message, openai) => {
  message.reply('one moment, crafting an image...');

  const imageResp = await openai.createImage({
    prompt,
    n: 1,
    size: '1024x1024',
  });
  const imageUrl = imageResp.data.data[0].url;
  const embed = buildEmbed(imageUrl);
  return message.reply({ embeds: [embed] });
};
