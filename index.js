require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const { handleError } = require('./utils/errorHandler');
const fs = require('fs');
const { COMMAND_ALIASES } = require('./utils/constants');

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

const prefix = process.env.PREFIX || 'ai!';

client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

global.messages = [];
global.systemContent =
  'The platform is Discord, you can use markup to format your messages to fit with discord.';

client.on('messageCreate', async (message) => {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    let prompt = message.content.slice(prefix.length + command.length + 1);

    console.log(`${Date.now()}: ${message.author.username}: ${prompt}`);

    if (COMMAND_ALIASES['commands'].includes(command)) {
      return client.commands.get('commands').execute(message, client, prefix);
    }

    if (COMMAND_ALIASES['chat'].includes(command)) {
      return await client.commands.get('chat').execute(message, openai, prompt);
    }

    if (COMMAND_ALIASES['image'].includes(command)) {
      return await client.commands
        .get('image')
        .execute(message, openai, prompt);
    }

    if (COMMAND_ALIASES['image-variation'].includes(command)) {
      return await client.commands
        .get('image-variation')
        .execute(message, openai);
    }

    if (COMMAND_ALIASES['image-edit'].includes(command)) {
      return await client.commands
        .get('image-edit')
        .execute(message, openai, prompt);
    }
    if (COMMAND_ALIASES['random-image'].includes(command)) {
      return await client.commands
        .get('random-image')
        .execute(message, prompt || '1', openai);
    }

    if (COMMAND_ALIASES['code'].includes(command)) {
      return await client.commands.get('code').execute(message, openai, prompt);
    }

    if (command === 'legacy-chat') {
      return await client.commands
        .get('legacy-chat')
        .execute(message, openai, prompt);
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

  if (process.env.NODE_ENV === 'production') {
    client.channels.cache
      .get('1059855592795144192')
      .send("Beep boop, I'm online!");
  }
});
