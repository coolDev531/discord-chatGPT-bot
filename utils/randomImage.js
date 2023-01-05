const sentences = [
  `I'm having a great day today and I hope you are too.`,
  'The quick brown fox jumps over the lazy dog.',
  'The cat sat on the mat.',
  'She sells seashells by the seashore.',
  'A bird in the hand is worth two in the bush.',
  'Early to bed and early to rise, makes a man healthy, wealthy and wise.',
  'A stitch in time saves nine.',
  'Que sera sera - whatever will be, will be.',
  'Rome was not built in a day.',
  'Nothing is impossible.',
  'A picture is worth a thousand words.',
  'He had to leave early due to unforeseen circumstances.',
  'We had already reached a conclusion before the argument began.',
  'She made sure to thank him for all of his hard work.',
  'Jack was ecstatic when he finally finished the project.',
  'Steve always prefers to take the long route instead of the short cut.',
  'I wondered if they had truly seen the world as it was.',
  'The result of sacrificing sleep had begun to show in her performance.',
  'The teacher encouraged her students to ask questions.',
  'He sometimes complained about the weather, but never did anything about it.',
  'Sara was determined to reach her goals no matter the cost.',
  'Success is a journey, not a destination.',
  'Spider-man',
  'Sonic The Hedgehog',
  "I'm a bot, beep boop.",
  'Money and Chess',
  'Allan Holdsworth',
  'Phish band',
  'Green Day',
  'Lionel Messi',
  'Rock Band',
  'Pop music artist performing live on stage female',
  'Pop music artist performing live on stage male',
  'oil painting of anything you want',
  'random oil painting created by AI',
  'low poly model of random animal',
  'random car',
  'random cartoon character',
  'random tree',
  'new york city',
  'music studio recording room',
];

module.exports = async (openai) => {
  const randomSentence =
    sentences[Math.floor(Math.random() * sentences.length)];

  const imageResp = await openai.createImage({
    prompt: randomSentence,
    n: 1,
    size: '1024x1024',
  });

  const imageUrl = imageResp.data.data[0].url;

  return imageUrl;
};
