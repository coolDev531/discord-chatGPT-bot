require('dotenv').config();

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
  codeai: ['codeai', 'code', 'codegpt', 'codebot', 'aicode'],
  commands: ['help', 'h', 'commands', 'cmds'],
};

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'text-davinci-003';

module.exports = {
  OPENAI_MODEL,
  COMMAND_ALIASES,
};
