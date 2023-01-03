require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
} = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const { handleError } = require('./utils/errorHandler');
const fsPromise = require('fs/promises');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const sharp = require('sharp');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const prefix = '!';

client.commands = new Collection();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) => {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const prompt = message.content.slice(prefix.length).replace(args[0], '');
    // console.log(prompt);
    const command = args.shift().toLowerCase();

    if (
      command.toLowerCase() === 'chatai' ||
      command.toLowerCase() === 'chatgpt' ||
      command.toLowerCase() === 'chatbot'
    ) {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        // prompt: args.join(' '),
        prompt: prompt,
        temperature: 1,
        max_tokens: 2049,
        // stop: ['ChatGPT:', `${message.author.username}:`],
      });

      message.reply(completion.data.choices[0].text);
      return;
    }

    if (command.toLowerCase() === 'aiimage') {
      const imageResp = await openai.createImage({
        prompt,
        n: 1,
        size: '1024x1024',
      });
      const imageUrl = imageResp.data.data[0].url;
      const embed = buildEmbed(imageUrl);
      return message.reply({ embeds: [embed] });
    }

    if (command.toLowerCase() === 'aiimagevariation') {
      message.reply('one moment, crafting an image...');
      const toBeConverted = [...message.attachments.values()][0];

      return axios({
        method: 'get',
        url: toBeConverted.url,
        responseType: 'stream',
      })
        .then(function (response) {
          const fileName = `${toBeConverted.id + Date.now()}`;
          response.data.pipe(fs.createWriteStream(`./files/${fileName}.png`));
          return response.data.on('end', async () => {
            // const buffer = await fsPromise.readFile(path);
            // buffer.name = toBeConverted.name || 'image'; // set the name of the buffer to the name of the file
            const originalImage = path.resolve(
              __dirname,
              `files/${fileName}.png`
            );
            await sharp(originalImage)
              .resize({
                width: 1024,
                height: 1024,
              })
              .toFile(path.resolve(__dirname, `files/${fileName}-resized.png`));

            const buffer = await fsPromise.readFile(
              `files/${fileName}-resized.png`
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
            await fsPromise.unlink(`files/${fileName}.png`); // delete the file when done
            await fsPromise.unlink(`files/${fileName}-resized.png`); // delete the file when done
            return;
          });
        })
        .catch((error) => {
          console.log(error);
          return handleError(message, 'error');
        });
    }
  } catch (error) {
    console.log(error.response.data.error.message);
    return handleError(message, error.response.data.error.message);
  }
});

function buildEmbed(url) {
  return new EmbedBuilder().setColor(0x0099ff).setURL(url).setImage(url);
}

client.login(process.env.DISCORD_TOKEN);
