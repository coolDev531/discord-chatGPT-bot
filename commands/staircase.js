const { handleError } = require('../utils/errorHandler');

const staircase = (numRows, userId) => {
  if (!userId) {
    throw new Error('staircase: userId is required');
  }

  // here we use just one for loop where i tracks the number of rows
  // the number of rows (i) should be less than or equal to n
  for (let i = 1; i <= numRows; i++) {
    // print out a " " n-i times and append a # i times
    // console log adds a new line by default

    console.log(' '.repeat(numRows - i) + `<@${userId}>`.repeat(i));
  }
};

const execute = async (message, numRows = 6) => {
  try {
    const userId = message.mentions.users.first()?.id;

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
