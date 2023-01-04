const { handleError } = require('../utils/errorHandler');

module.exports = async (message, openai, prompt) => {
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      // prompt: args.join(' '),
      prompt: prompt,
      temperature: 1,
      max_tokens: 2049,
      // stop: ['ChatGPT:', `${message.author.username}:`],
    });

    message.reply(completion.data.choices[0].text);
  } catch (error) {
    console.log(error.response.data.error.message);
    return handleError(message, error.response.data.error.message);
  }
};
