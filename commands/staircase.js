const { handleError } = require('../utils/errorHandler');

const staircase = (numRows, userId) => {
  let str = '';
  if (!userId) {
    throw new Error('staircase: userId is required');
  }

  // here we use just one for loop where i tracks the number of rows
  // the number of rows (i) should be less than or equal to n
  for (let i = 1; i <= numRows; i++) {
    // print out a " " n-i times and append a # i times
    // console log adds a new line by default

    const currentRow = ' '.repeat(numRows - i) + `<@${userId}>`.repeat(i);
    str += currentRow + '\n';
  }

  return str;
};

const splitAndSend = async (text, message, prompt) => {
  const MAX_LENGTH = 2000;

  const chunks = [];

  for (let i = 0; i < text.length; i += MAX_LENGTH) {
    const chunk = text.slice(i, i + MAX_LENGTH);
    chunks.push(chunk);
  }

  for await (const chunk of chunks) {
    if (!chunk) continue;
    await message.channel.send(chunk);
  }
};

const execute = async (message, args) => {
  try {
    const userId = message.mentions.users.first()?.id;

    const numRows = Number(args?.[1]) ?? 6;
    const MAX_CHARS = 2000;

    if (!userId) {
      return await message.reply('Please provide a user to ping');
    }

    if (!numRows) {
      return await message.reply('Please provide a number of rows');
    }

    if (isNaN(+numRows)) {
      return await message.reply('Please provide a valid number');
    }

    if (+numRows > 20) {
      return await message.reply('Please provide a number less than 20');
    }

    const scase = staircase(+numRows, userId);

    if (scase.length > MAX_CHARS) {
      await splitAndSend(scase, message);

      return;
    }

    return await message.reply(scase);
  } catch (error) {
    console.log(error);
    return handleError(message, error);
  }
};

module.exports = {
  name: 'staircase',
  description: 'Staircase ping a user',
  execute,
};
