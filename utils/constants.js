require('dotenv').config();

const COMMAND_ALIASES = {
  chat: ['chatai', 'chat', 'chatgpt', 'chatbot', 'aichat'],
  image: ['aiimage', 'imageai', 'image', 'make-image'],
  'image-variation': [
    'aiimagevariation',
    'aiimagevar',
    'imagevariation',
    'image-variation',
    'imagevar',
    'image-var',
    'reviseimage',
    'aireviseimage',
  ],
  'image-edit': [
    'image-edit',
    'imageedit',
    'editimage',
    'aiimageedit',
    'aieditimage',
  ],
  'random-image': [
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
  code: ['codeai', 'code', 'codegpt', 'codebot', 'aicode'],
  commands: ['help', 'h', 'commands', 'cmds'],
};

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'text-davinci-003';

module.exports = {
  OPENAI_MODEL,
  COMMAND_ALIASES,
};
