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

const OPENAI_MODEL = 'gpt-3.5-turbo';

module.exports = {
  OPENAI_MODEL,
  COMMAND_ALIASES,
};
