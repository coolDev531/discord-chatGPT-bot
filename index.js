require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
} = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const { handleError } = require('./utils/errorHandler');
const aiimage = require('./commands/aiimage');
const aiimagevariation = require('./commands/aiimagevariation');

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

    if (
      command.toLowerCase() === 'aiimage' ||
      command.toLowerCase() === 'imageai'
    ) {
      return aiimage(message, openai);
    }

    if (
      command.toLowerCase() === 'aiimagevariation' ||
      command.toLowerCase() === 'aiimagevar' ||
      command.toLowerCase() === 'aireviseimage'
    ) {
      return aiimagevariation(message, openai);
    }
  } catch (error) {
    console.log(error.response.data.error.message);
    return handleError(message, error.response.data.error.message);
  }
});

client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log('ready');
});
