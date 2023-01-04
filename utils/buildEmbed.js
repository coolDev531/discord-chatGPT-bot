function buildEmbed(url) {
  return new EmbedBuilder().setColor(0x0099ff).setURL(url).setImage(url);
}

module.exports = buildEmbed;
