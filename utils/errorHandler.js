const { EmbedBuilder } = require('discord.js');

/**
 * @method handleError
 * @param {Object} message
 * @param {String} error
 * @return {MessageEmbed}
 */
const handleError = async (message, error) => {
  global.messages = [];

  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle('Error')
    .setDescription(error);

  message.reply({ embeds: [embed] });
};

module.exports = { handleError };
