(() => {
  const { norm, pick, parseName } = window.MU;

  const NOUNS = [
    ['огурец', 'm'], ['философ', 'm'], ['стейк', 'm'], ['салат', 'm'], ['математик', 'm'],
    ['ковбой', 'm'], ['телефон', 'm'], ['полицейский', 'm'], ['бабушка', 'f'], ['кошка', 'f'],
    ['луна', 'f'], ['сосиска', 'f'], ['балерина', 'f'], ['электричество', 'n'], ['облако', 'n'],
    ['пианино', 'n'], ['яйцо', 'n'],
  ];
  const ADJ = [
    ['бессонный', 'бессонная', 'бессонное'], ['электрический', 'электрическая', 'электрическое'],
    ['безумный', 'безумная', 'безумное'], ['задумчивый', 'задумчивая', 'задумчивое'],
    ['фиолетовый', 'фиолетовая', 'фиолетовое'], ['холодный', 'холодная', 'холодное'],
    ['яростный', 'яростная', 'яростное'], ['нежный', 'нежная', 'нежное'],
    ['ржавый', 'ржавая', 'ржавое'], ['вечный', 'вечная', 'вечное'], ['мокрый', 'мокрая', 'мокрое'],
  ];
  const VERBS = ['мечтает', 'поёт', 'размышляет', 'тоскует', 'шепчет', 'вопит', 'танцует', 'плачет', 'спорит', 'грезит'];
  const ABOUT = [
    'о говядине', 'о бесконечности', 'о салате', 'об электричестве', 'о холодном супе',
    'о своей бабушке', 'о вечном двигателе', 'о налогах', 'о сладком безумии', 'о любви и майонезе',
    'о логарифмах', 'о сырой морковке', 'о смысле стейка',
  ];
  const WHERE = [
    'в темноте', 'под дождём', 'на крыше', 'в стакане молока', 'в пустом холодильнике',
    'посреди ночи', 'в трамвае', 'на дне кастрюли',
  ];
  const ASK = [
    'Скажите, NAME, вы любите стейк?',
    'NAME, что вы думаете о салате?',
    'Вы когда-нибудь пели, NAME?',
    'Какой ваш любимый овощ, NAME?',
    'NAME, вам снится электричество?',
  ];

  const NOUNS_EN = [
    'cucumber', 'philosopher', 'steak', 'salad', 'mathematician', 'cowboy', 'telephone', 'policeman',
    'grandmother', 'cat', 'moon', 'sausage', 'ballerina', 'electricity', 'cloud', 'piano', 'egg',
  ];
  const ADJ_EN = [
    'sleepless', 'electric', 'insane', 'pensive', 'violet', 'cold', 'furious', 'tender', 'rusty', 'eternal', 'wet',
  ];
  const VERBS_EN = ['dreams', 'sings', 'muses', 'yearns', 'whispers', 'shrieks', 'dances', 'weeps', 'argues', 'daydreams'];
  const ABOUT_EN = [
    'about beef', 'about infinity', 'about salad', 'about electricity', 'about cold soup',
    'about its grandmother', 'about perpetual motion', 'about taxes', 'about sweet madness', 'about love and mayonnaise',
    'about logarithms', 'about raw carrots', 'about the meaning of steak',
  ];
  const WHERE_EN = [
    'in the dark', 'in the rain', 'on the roof', 'in a glass of milk', 'in an empty refrigerator',
    'in the middle of the night', 'on a tram', 'at the bottom of a saucepan',
  ];
  const ASK_EN = [
    'Tell me, NAME, do you like steak?',
    'NAME, what do you think of salad?',
    'Have you ever sung, NAME?',
    'What is your favorite vegetable, NAME?',
    'NAME, do you dream of electricity?',
  ];

  const IDX = { m: 0, f: 1, n: 2 };
  const npRu = () => {
    const [n, g] = pick(NOUNS);
    return `${pick(ADJ)[IDX[g]]} ${n}`;
  };
  const npEn = () => {
    const a = pick(ADJ_EN);
    return `${/^[aeiou]/.test(a) ? 'an' : 'a'} ${a} ${pick(NOUNS_EN)}`;
  };
  const cap = (s) => s[0].toUpperCase() + s.slice(1);

  function create() {
    const en = window.MU.en;
    const np = en ? npEn : npRu;
    const clause = en
      ? () => `${np()} ${pick(VERBS_EN)} ${pick(ABOUT_EN)}`
      : () => `${np()} ${pick(VERBS)} ${pick(ABOUT)}`;
    const where = () => pick(en ? WHERE_EN : WHERE);
    let name = null;
    const words = [];

    const sentenceEn = () => {
      const w = words.length ? pick(words) : null;
      const forms = [
        () => `${name}, ${clause()}, while ${clause()} ${where()}.`,
        () => `Did you know, ${name}, that ${clause()}?`,
        () => `At night ${clause()}. In the morning ${clause()}. Such is fate, ${name}.`,
        () => `${cap(clause())} ${where()}. That is life.`,
        () => `I like ${name}. ${name} is like the way ${clause()}.`,
        () => (w ? `The word "${w}" reminds me of how ${clause()} ${where()}.` : `${cap(clause())}.`),
        () => (w ? `"${cap(w)}," says ${np()}, and ${clause()}.` : `${cap(clause())}.`),
        () => pick(ASK_EN).replace(/NAME/g, name),
      ];
      return pick(forms)();
    };

    const sentenceRu = () => {
      const w = words.length ? pick(words) : null;
      const forms = [
        () => `${name}, ${clause()}, пока ${clause()} ${pick(WHERE)}.`,
        () => `Знаете ли вы, ${name}, что ${clause()}?`,
        () => `Ночью ${clause()}. Утром ${clause()}. Таков удел, ${name}.`,
        () => `${cap(clause())} ${pick(WHERE)}. Это и есть жизнь.`,
        () => `Мне нравится ${name}. ${name} похож на то, как ${clause()}.`,
        () => (w ? `Слово «${w}» напоминает мне, как ${clause()} ${pick(WHERE)}.` : `${cap(clause())}.`),
        () => (w ? `«${cap(w)}», — говорит ${np()}, и ${clause()}.` : `${cap(clause())}.`),
        () => pick(ASK).replace(/NAME/g, name),
      ];
      return pick(forms)();
    };
    const sentence = en ? sentenceEn : sentenceRu;

    return {
      greet: () => (en ? 'Hello. I am Racter. What is your name?' : 'Привет. Я Рактер. Как вас зовут?'),
      reply(input) {
        const raw = input.trim();
        if (!name) {
          const w = parseName(raw);
          name = w ? cap(w.toLowerCase()) : en ? 'Stranger' : 'Незнакомец';
          return en
            ? `${name}? A splendid name. ${cap(clause())} ${where()}. Tell me something, ${name}.`
            : `${name}? Прекрасное имя. ${cap(clause())} ${where()}. Расскажите мне что-нибудь, ${name}.`;
        }
        norm(raw).split(' ').filter((x) => x.length >= 5).forEach((x) => words.push(x));
        if (words.length > 30) words.splice(0, words.length - 30);
        const n = Math.random() < 0.5 ? 2 : 1;
        const out = [];
        for (let i = 0; out.length < n && i < 10; i++) {
          const x = sentence();
          if (!out.includes(x)) out.push(x);
        }
        return out.join(' ');
      },
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'racter',
    year: 1984,
    name: 'Racter',
    author: 'Уильям Чемберлен и Томас Эттер',
    place: 'США',
    machine: 'Apple II · 48K',
    ran: 'домашние компьютеры Apple II, Amiga, MS-DOS',
    now: 'не работает, код сохранился',
    theme: 't-racter',
    speed: 12,
    origin: 'reconstruction',
    source:
      'Сама программа Racter сохранилась, но её словарь и шаблоны здесь не использованы. Воссоздан принцип: фразы собираются по грамматическим шаблонам из случайных слов, а имя и слова собеседника вплетаются в текст. Словарь и шаблоны придуманы заново.',
    lead: 'Racter (от слова raconteur — «рассказчик») не отвечал на вопросы, а сочинял. Он запоминал ваше имя и слова и вплетал их в сюрреалистическую прозу про стейки, электричество и безумие.',
    how: 'Racter собирал фразы по грамматическим шаблонам: «прилагательное + существительное + глагол + о чём-то». Слова брались из словаря случайно, но так, чтобы предложение было грамматически правильным. Ваши слова он сохранял и подставлял обратно — отсюда ощущение, что он «отвечает».',
    facts: [
      'В 1984 году вышла книга «Борода полицейского наполовину построена», автором которой назван Racter.',
      'Критики подозревали, что тексты для книги отбирались и редактировались людьми.',
      'Продавался как программа для Apple II, Amiga и MS-DOS.',
      'Написан на специальном языке шаблонов INRAC.',
    ],
    tries: ['Меня зовут Алиса', 'Я люблю кофе', 'Что такое жизнь?', 'Расскажи про электричество'],
    en: {
      ran: 'home computers: Apple II, Amiga, MS-DOS',
      now: 'offline, code preserved',
      author: 'William Chamberlain and Thomas Etter',
      place: 'USA',
      source:
        'The Racter program itself survives, but its dictionary and templates are not used here. The principle is rebuilt: sentences are assembled from random words by grammatical templates, and the visitor\'s name and words are woven into the text. The dictionary and templates are newly invented.',
      lead: 'Racter (from the word raconteur, “storyteller”) did not answer questions — it composed. It remembered your name and your words and wove them into surreal prose about steaks, electricity and madness.',
      how: 'Racter built sentences from grammatical templates: “adjective + noun + verb + about something”. The words were taken from the dictionary at random, but so that the sentence stayed grammatically correct. It saved your words and put them back in — that is where the feeling that it “answers” comes from.',
      facts: [
        'In 1984 the book “The Policeman’s Beard Is Half Constructed” came out, with Racter named as its author.',
        'Critics suspected that the texts for the book were selected and edited by people.',
        'It was sold as a program for the Apple II, Amiga and MS-DOS.',
        'It was written in a special template language, INRAC.',
      ],
      tries: ['My name is Alice', 'I love coffee', 'What is life?', 'Tell me about electricity'],
    },
    create,
  });
})();
