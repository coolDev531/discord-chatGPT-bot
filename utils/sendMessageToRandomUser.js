const buildEmbed = require('./buildEmbed');
const randomImage = require('./randomImage');

module.exports = async (client) => {
  // Get a random guild
  const user = client.users.random();

  const imageUrl = await randomImage();
  const embed = buildEmbed(imageUrl);

  return await user.send({ embeds: [embed] });
};
