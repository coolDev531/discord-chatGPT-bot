require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const { handleError } = require('./utils/errorHandler');
const aiimage = require('./commands/aiimage');
const aiimagevariation = require('./commands/aiimagevariation');
const chatai = require('./commands/chatai');

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
    const command = args.shift().toLowerCase();

    console.log(`${Date.now()}: ${message.author.username}: ${prompt}`);

    if (
      command.toLowerCase() === 'chatai' ||
      command.toLowerCase() === 'chatgpt' ||
      command.toLowerCase() === 'chatbot'
    ) {
      return await chatai(message, openai, prompt);
    }

    if (
      command.toLowerCase() === 'aiimage' ||
      command.toLowerCase() === 'imageai'
    ) {
      return await aiimage(message, openai, prompt);
    }

    if (
      command.toLowerCase() === 'aiimagevariation' ||
      command.toLowerCase() === 'aiimagevar' ||
      command.toLowerCase() === 'aireviseimage'
    ) {
      return await aiimagevariation(message, openai);
    }
  } catch (error) {
    console.log(error?.response?.data?.error?.message || error);
    return handleError(
      message,
      error?.response?.data?.error?.message || JSON.stringify(error)
    );
  }
});

client.login(process.env.DISCORD_TOKEN).then(() => {
  console.log('ready');
});
