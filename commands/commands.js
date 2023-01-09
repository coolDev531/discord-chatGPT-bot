const execute = (message, client, prefix) => {
  return [...client.commands.values()].forEach((command) => {
    message.channel.send(
      `Command: ${prefix}${command.name} - ${command.description}`
    );
  });
};

module.exports = {
  name: 'commands',
  description: 'Get the list of commands for ChatGPT Chatbot',
  execute,
};
