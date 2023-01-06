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

const prefix = '!';

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

client.on('messageCreate', async (message) => {
  try {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    let prompt = message.content.slice(prefix.length + command.length + 1);

    console.log(`${Date.now()}: ${message.author.username}: ${prompt}`);

    if (COMMAND_ALIASES['chatai'].includes(command)) {
      return await client.commands
        .get('chatai')
        .execute(message, openai, prompt);
    }

    if (COMMAND_ALIASES['aiimage'].includes(command)) {
      return await client.commands
        .get('aiimage')
        .execute(message, openai, prompt);
    }

    if (COMMAND_ALIASES['aiimagevariation'].includes(command)) {
      return await client.commands
        .get('aiimagevariation')
        .execute(message, openai);
    }

    if (COMMAND_ALIASES['aiimageedit'].includes(command)) {
      return await client.commands
        .get('aiimageedit')
        .execute(message, openai, prompt);
    }
    if (COMMAND_ALIASES['randomimage'].includes(command)) {
      return await client.commands
        .get('aiimageedit')
        .execute(message, prompt || '1', openai);
    }

    if (COMMAND_ALIASES['codeai'].includes(command)) {
      return await client.commands
        .get('codeai')
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
