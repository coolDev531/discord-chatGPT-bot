const execute = (message, client, prefix) => {
  let result = '';

  [...client.commands.values()].forEach((command) => {
    const str = `- ${prefix}${command.name} - ${command.description}`;
    result += `${str} \n`;
  });

  return message.reply(result);
};

module.exports = {
  name: 'commands',
  description: 'Get the list of commands for ChatGPT Chatbot',
  execute,
};
