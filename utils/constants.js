require('dotenv').config();

const COMMAND_ALIASES = {
  chatai: ['chatai', 'chat', 'chatgpt', 'chatbot', 'aichat'],
  aiimage: ['aiimage', 'imageai', 'image', 'make-image'],
  aiimagevariation: [
    'aiimagevariation',
    'aiimagevar',
    'imagevariation',
    'image-variation',
    'imagevar',
    'image-var',
    'reviseimage',
    'aireviseimage',
  ],
  aiimageedit: [
    'image-edit',
    'imageedit',
    'editimage',
    'aiimageedit',
    'aieditimage',
  ],
  randomimage: [
    'random-image',
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
