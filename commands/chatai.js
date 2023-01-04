module.exports = async (message, openai, prompt) => {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    // prompt: args.join(' '),
    prompt: prompt,
    temperature: 1,
    max_tokens: 2049,
    // stop: ['ChatGPT:', `${message.author.username}:`],
  });

  message.reply(completion.data.choices[0].text);
};
