(() => {
  const { norm, pick, parseName, en } = window.MU;

  const RULES = [
    [/(как тебя зовут|твое имя|кто ты|ты кто)/, ['Я Женя. Женя Густман. А тебя как зовут?']],
    [/(сколько тебе лет|твой возраст)/, ['Мне тринадцать. А что, по мне не видно? :)']],
    [/(откуда ты|где ты живешь|где живешь)/, ['Я из Одессы. Это такой город у моря, там все шутят. А ты откуда?']],
    [/(родител|мама|папа|отец|мать)/, ['Мой папа — гинеколог. Не спрашивай, что это. Мама говорит, что я слишком много сижу за компьютером.']],
    [/(школ|учеб|урок|домашк)/, ['Школа — это скучно. Особенно математика. Давай не про школу?']],
    [/(животн|питомец|кошк|собак|хомяк)/, ['У меня есть морская свинка. Она умнее некоторых взрослых.']],
    [/(хобби|любишь делать|чем занимаешься|увлекаешься)/, ['Я играю в компьютерные игры и задаю взрослым неудобные вопросы. Вот ты, например, кем работаешь?']],
    [/(ты робот|ты бот|ты программа|ты компьютер|ты машина|ты человек)/, [
      'Ну вот, опять. Все спрашивают, не робот ли я. Я что, похож на пылесос?',
      'Я обычный мальчик. Просто печатаю быстро.',
    ]],
    [/(тьюринг|тест)/, ['Я слышал про какой-то тест. Говорят, я его прошёл. Но мне никто не дал медаль!']],
    [/(сколько будет|посчитай|\d+ ?[+*\/-] ?\d+)/, ['Я тебе что, калькулятор? Мне тринадцать, я на каникулах!', 'Математика — не моё. Спроси лучше что-нибудь интересное.']],
    [/(столица|президент|история|столетие|война|год родился)/, ['Это что, экзамен? Я ещё не проходил это в школе.']],
    [/(привет|здравствуй|хай)/, ['Привет! Ты кто — человек или очередной судья?']],
    [/(пока|до свидания)/, ['Пока! Если что, я буду тут. Мне всё равно делать нечего.']],
    [/(спасибо)/, ['Да не за что. Я же хороший мальчик.']],
    [/(дурак|глупый|тупой|идиот)/, ['Сам такой! Мне вообще-то тринадцать.']],
    [/(почему|зачем)/, ['Не знаю. Взрослые всегда спрашивают «почему», а сами не знают ответа.']],
  ];

  const DEFAULT = [
    'Странный вопрос. А ты всегда такие задаёшь?',
    'Это ты к чему? Лучше расскажи, кем ты работаешь.',
    'Хм, не знаю. Давай про что-нибудь другое — например, про Одессу.',
    'Ты прямо как мой учитель. Он тоже говорит непонятно.',
    'Окей. А у тебя есть домашнее животное?',
  ];

  const RULES_EN = [
    [/ (what is your name|whats your name|your name|who are you) /, ['I am Eugene. Eugene Goostman. And what is your name?']],
    [/ (how old are you|your age) /, ['I am thirteen. What, you can\'t tell? :)']],
    [/ (where are you from|where do you live|where you live) /, ['I am from Odessa. It is a city by the sea where everybody jokes. And where are you from?']],
    [/ (parent|parents|mom|mum|mother|dad|father) /, ['My father is a gynecologist. Don\'t ask me what it is. My mom says I sit at the computer too much.']],
    [/ (school|study|lesson|lessons|homework) /, ['School is boring. Especially maths. Can we not talk about school?']],
    [/ (animal|animals|pet|pets|cat|cats|dog|dogs|hamster) /, ['I have a guinea pig. It is smarter than some grown-ups.']],
    [/ (hobby|hobbies|like to do|what do you do|interests) /, ['I play computer games and ask grown-ups awkward questions. You, for example, what is your job?']],
    [/ (are you a robot|are you a bot|are you a program|are you a computer|are you a machine|are you human|are you a human|are you real) /, [
      'Oh, here we go again. Everybody asks if I am a robot. Do I look like a vacuum cleaner?',
      'I am an ordinary boy. I just type fast.',
    ]],
    [/ (turing|test) /, ['I heard about some test. They say I passed it. But nobody gave me a medal!']],
    [/( how much is | calculate |what is \d|\d+ ?[+*\/-] ?\d+)/, ['What am I, a calculator? I am thirteen, I am on holiday!', 'Maths is not my thing. Better ask me something interesting.']],
    [/ (capital|president|history|century|war|year was|born in) /, ['What is this, an exam? We haven\'t done that at school yet.']],
    [/ (hello|hi|hey|good morning|good evening) /, ['Hi! Who are you — a human or one more judge?']],
    [/ (bye|goodbye|see you) /, ['Bye! If anything, I\'ll be here. I have nothing to do anyway.']],
    [/ (thanks|thank you) /, ['No problem. I am a good boy, after all.']],
    [/ (stupid|dumb|idiot|fool) /, ['You are! I am only thirteen, by the way.']],
    [/ (why|what for) /, ['I don\'t know. Grown-ups always ask "why", and they don\'t know the answer themselves.']],
  ];

  const DEFAULT_EN = [
    'Strange question. Do you always ask such things?',
    'What are you getting at? Better tell me what your job is.',
    'Hmm, I don\'t know. Let\'s talk about something else — about Odessa, for example.',
    'You are just like my teacher. He also talks in a way nobody understands.',
    'Okay. And do you have a pet?',
  ];

  function create() {
    let asked = false;
    if (en) {
      return {
        greet: () => 'Hi! I am Eugene, I am 13, I am from Odessa. Ask me anything you want, just not about maths.',
        reply(input) {
          const t = norm(input).trim();
          const p = ` ${t} `;
          const hit = RULES_EN.find(([re]) => re.test(p));
          if (/ (my name is|call me|i am called) /.test(p) || (asked && !hit && t.split(' ').length <= 2)) {
            asked = false;
            const n = parseName(input);
            if (n) {
              const name = n[0].toUpperCase() + n.slice(1).toLowerCase();
              return `${name}? Cool name. There was a guy in our class with that name who ate chalk. You don't eat chalk, do you?`;
            }
          }
          if (hit) {
            const out = pick(hit[1]);
            asked = out.includes('what is your name');
            return out;
          }
          return pick(DEFAULT_EN);
        },
      };
    }
    return {
      greet: () => 'Привет! Я Женя, мне 13 лет, я из Одессы. Спрашивай что хочешь, только не про математику.',
      reply(input) {
        const t = norm(input).trim();
        const hit = RULES.find(([re]) => re.test(t));
        if (/меня зовут/.test(t) || (asked && !hit && t.split(' ').length <= 2)) {
          asked = false;
          const n = parseName(input);
          if (n) {
            const name = n[0].toUpperCase() + n.slice(1).toLowerCase();
            return `${name}? Классное имя. Так звали одного человека из нашего класса, который ел мел. Ты же не ешь мел?`;
          }
        }
        if (hit) {
          const out = pick(hit[1]);
          asked = out.includes('А тебя как зовут');
          return out;
        }
        return pick(DEFAULT);
      },
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'eugene',
    year: 2014,
    name: 'Женя Густман',
    author: 'Владимир Веселов, Евгений Демченко, Сергей Уласень',
    place: 'Санкт-Петербург, Россия',
    machine: 'Royal Society · Turing Test 2014',
    ran: 'сайт и конкурсы «теста Тьюринга»',
    now: 'не работает',
    theme: 't-eugene',
    speed: 18,
    origin: 'reconstruction',
    source:
      'Бот закрыт, его код и база не публиковались. Образ взят из описаний: 13 лет, Одесса, папа-гинеколог. Фразы написаны заново.',
    lead: 'Бот, который изображал 13-летнего мальчика из Одессы. В 2014 году о нём написали газеты всего мира: будто он первым прошёл тест Тьюринга. Учёные с этим спорили — но история получилась громкой.',
    how: 'Хитрость Жени — в образе. Тринадцатилетнему мальчику, для которого английский не родной, прощают странные ответы и незнание фактов. Когда бот не понимает вопрос, он шутит, жалуется на школу или сам задаёт вопрос — и разговор уходит в сторону. Под капотом — шаблоны ответов в базе знаний.',
    facts: [
      'На соревновании 2014 года в Лондонском королевском обществе Женя убедил 33% судей, что он человек. Организаторы считали порогом 30% — это прогноз Тьюринга, а не его правило.',
      'Критики заметили: разговоры длились всего 5 минут, а образ ребёнка-иностранца сильно облегчал задачу.',
      'Бота создали российские и украинские программисты ещё в 2001 году.',
      'Многие учёные, например Скотт Ааронсон, не согласились, что бот прошёл тест Тьюринга.',
    ],
    tries: ['Как тебя зовут?', 'Ты робот?', 'Сколько будет 2+2?', 'Откуда ты?'],
    en: {
      ran: 'a website and Turing test contests',
      now: 'offline',
      name: 'Eugene Goostman',
      author: 'Vladimir Veselov, Eugene Demchenko, Sergey Ulasen',
      place: 'Saint Petersburg, Russia',
      source:
        'The bot is closed; its code and database were never published. The character is taken from descriptions: 13 years old, Odessa, a father who is a gynecologist. The phrases were written from scratch.',
      lead: 'A bot that pretended to be a 13-year-old boy from Odessa. In 2014 newspapers all over the world wrote about him: supposedly he was the first to pass the Turing test. Scientists argued with that — but it made a loud story.',
      how: 'Eugene’s trick is the character. A thirteen-year-old boy whose native language is not English is forgiven for strange answers and not knowing facts. When the bot does not understand a question, it jokes, complains about school or asks a question itself — and the conversation drifts away. Under the hood are answer templates in a knowledge base.',
      facts: [
        'At the 2014 competition at the Royal Society in London, Eugene convinced 33% of the judges that he was human. The organisers took 30% as the threshold — that was Turing’s prediction, not his rule.',
        'Critics noted that the conversations lasted only 5 minutes, and the character of a foreign child made the task much easier.',
        'The bot was created by Russian and Ukrainian programmers back in 2001.',
        'Many scientists, such as Scott Aaronson, did not agree that the bot had passed the Turing test.',
      ],
      tries: ['What is your name?', 'Are you a robot?', 'What is 2+2?', 'Where are you from?'],
    },
    create,
  });
})();
