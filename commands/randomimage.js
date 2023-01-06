const buildEmbed = require('../utils/buildEmbed');
const randomImage = require('../utils/randomImage');

const execute = async (message, prompt = '1', openai) => {
  let num = Number(prompt.trim().match(/\d+/)[0]);

  const restOfText = num > 1 ? `${num} random images` : 'a random image';

  const initialMsg = await message.reply(
    `One moment,I'm crafting ${restOfText}...`
  );

  if (!!num && num > 1) {
    const embeds = [];
    while (num > 0) {
      const imageUrl = await randomImage(openai);
      const embed = buildEmbed(imageUrl);
      embeds.push(embed);
      num--;
    }

    initialMsg.delete();
    return await message.reply({ embeds });
  }

  const imageUrl = await randomImage(openai);
  const embed = buildEmbed(imageUrl);

  initialMsg.delete();
  return await message.reply({ embeds: [embed] });
};

module.exports = {
  name: 'randomimage',
  description: "Generate a random image using OpenAI's API",
  execute,
};
