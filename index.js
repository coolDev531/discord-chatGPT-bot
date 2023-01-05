require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const { handleError } = require('./utils/errorHandler');
const aiimage = require('./commands/aiimage');
const aiimagevariation = require('./commands/aiimagevariation');
const chatai = require('./commands/chatai');
const aiimageedit = require('./commands/aiimageedit');
const randomimage = require('./commands/randomimage');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

const prefix = '!';

client.commands = new Collection();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

const COMMAND_ALIASES = {
  chatai: ['chatai', 'chat', 'chatgpt', 'chatbot', 'aichat'],
  aiimage: ['aiimage', 'imageai', 'image', 'makeimage'],
  aiimagevariation: [
    'aiimagevariation',
    'aiimagevar',
    'imagevariation',
    'imagevar',
    'reviseimage',
    'aireviseimage',
  ],
  aiimageedit: ['imageedit', 'editimage', 'aiimageedit', 'aieditimage'],
  randomimage: [
    'randomimage',
    'random',
    'randomimg',
    'randompic',
    'airandomimage',
    'airandompic',
    'airandomimg',
    'rand',
  ],
};

client.on('messageCreate', async (message) => {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const prompt = message.content.slice(prefix.length).replace(args[0], '');
    const command = args.shift().toLowerCase();

    console.log(`${Date.now()}: ${message.author.username}: ${prompt}`);

    if (COMMAND_ALIASES['chatai'].includes(command)) {
      return await chatai(message, openai, prompt);
    }

    if (COMMAND_ALIASES['aiimage'].includes(command)) {
      return await aiimage(message, openai, prompt);
    }

    if (COMMAND_ALIASES['aiimagevariation'].includes(command)) {
      return await aiimagevariation(message, openai);
    }

    if (COMMAND_ALIASES['aiimageedit'].includes(command)) {
      return await aiimageedit(message, openai, prompt);
    }
    if (COMMAND_ALIASES['randomimage'].includes(command)) {
      return await randomimage(message, prompt || '1', openai);
    }
  } catch (error) {
    console.log(error?.response?.data?.error?.message || error);
    return handleError(
      message,
      error?.response?.data?.error?.message || JSON.stringify(error)
    );
  }
});

client.login(process.env.DISCORD_TOKEN);

client.on('ready', () => {
  console.log("Beep boop, I'm online!");

  // Listening to xxx users
  client.user.setActivity(
    `${client.guilds.cache
      .map((guild) => {
        return guild.memberCount;
      })
      .reduce((acc, cv) => acc + cv)} users`,
    { type: 'LISTENING' }
  );

  if (process.env.node_env === 'production') {
    client.channels.cache
      .get('1059855592795144192')
      .send("Beep boop, I'm online!");
  }
});
