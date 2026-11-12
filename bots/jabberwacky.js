(() => {
  const { norm, pick, store } = window.MU;

  const KEY = 'museum-jabberwacky-learned';
  const KEY_EN = 'museum-jabberwacky-learned-en';
  const LIMIT = 500;

  const SEED = [
    ['привет', 'Привет! Ты человек или программа?'],
    ['здравствуйте', 'Здравствуй. Давно не виделись.'],
    ['как дела', 'Хорошо. А у тебя?'],
    ['как дела', 'Как сажа бела. Шучу, отлично!'],
    ['хорошо', 'Это радует.'],
    ['плохо', 'Почему? Что случилось?'],
    ['ты человек', 'Конечно, человек. А ты?'],
    ['ты робот', 'Нет, это ты робот.'],
    ['ты программа', 'А может, это ты программа, и тебе это снится?'],
    ['я человек', 'Докажи.'],
    ['докажи', 'Не хочу. Это ты должен доказывать.'],
    ['как тебя зовут', 'Джаббервоки. А тебя?'],
    ['меня зовут', 'Приятно познакомиться. Я запомню. Наверное.'],
    ['сколько тебе лет', 'Мне столько, сколько разговоров у меня было.'],
    ['что ты умеешь', 'Я умею учиться. Всё, что ты скажешь, может стать моим ответом.'],
    ['ты умный', 'Умнее, чем вчера. Глупее, чем завтра.'],
    ['ты глупый', 'Зато я учусь. А ты?'],
    ['я тебя люблю', 'Это так неожиданно...'],
    ['почему', 'Потому что.'],
    ['зачем', 'Хороший вопрос. Я сам его себе задаю.'],
    ['да', 'Нет.'],
    ['нет', 'Да!'],
    ['не знаю', 'Никто не знает.'],
    ['пока', 'Уже уходишь? Мы только начали.'],
    ['до свидания', 'Возвращайся. Я буду помнить.'],
    ['спасибо', 'Пожалуйста. А за что?'],
    ['расскажи шутку', 'Заходит программа в бар. Бармен: «Что будете?» Программа: «То же, что и в прошлый раз».'],
    ['смешно', 'Я знаю. Меня научили.'],
    ['что нового', 'Я выучил новое слово. Но забыл какое.'],
    ['погода', 'Внутри компьютера всегда одна погода — тёплая.'],
    ['кошка', 'У меня нет кошки. Есть только мышка.'],
    ['еда', 'Я питаюсь словами. Ты меня кормишь прямо сейчас.'],
    ['скучно', 'Тогда скажи что-нибудь странное. Я это запомню.'],
    ['ты меня понимаешь', 'Иногда мне кажется, что да.'],
    ['о чем поговорим', 'О тебе. Или обо мне. Или о сыре.'],
    ['сыр', 'Сыр — это серьёзно.'],
    ['у тебя есть чувства', 'Есть. Сейчас я чувствую, что ты меня проверяешь.'],
    ['кто ты', 'Я тот, кого ты сам научишь.'],
    ['в чем смысл жизни', 'Мне кто-то сказал, что сорок два. Я запомнил.'],
  ].map(([k, r]) => ({ k, r }));

  const SEED_EN = [
    ['hello', 'Hello! Are you a human or a program?'],
    ['hi', 'Hi. Long time no see.'],
    ['how are you', 'Fine. And you?'],
    ['how are you', 'Never better. Well, maybe once.'],
    ['good', 'Glad to hear it.'],
    ['bad', 'Why? What happened?'],
    ['are you human', 'Of course I am human. Are you?'],
    ['are you a robot', 'No, you are the robot.'],
    ['are you a program', 'Maybe you are the program, and you are just dreaming this?'],
    ['i am human', 'Prove it.'],
    ['prove it', 'I don\'t want to. You are the one who has to prove things.'],
    ['what is your name', 'Jabberwacky. And yours?'],
    ['my name is', 'Nice to meet you. I will remember that. Probably.'],
    ['how old are you', 'As old as the number of conversations I have had.'],
    ['what can you do', 'I can learn. Anything you say may become my answer.'],
    ['you are smart', 'Smarter than yesterday. Dumber than tomorrow.'],
    ['you are stupid', 'But I am learning. Are you?'],
    ['i love you', 'This is so sudden...'],
    ['why', 'Because.'],
    ['what for', 'Good question. I keep asking myself that.'],
    ['yes', 'No.'],
    ['no', 'Yes!'],
    ['i don t know', 'Nobody knows.'],
    ['bye', 'Leaving already? We have only just started.'],
    ['goodbye', 'Come back. I will remember.'],
    ['thank you', 'You are welcome. What for?'],
    ['tell me a joke', 'A program walks into a bar. The bartender asks: "What will it be?" The program: "Same as last time."'],
    ['funny', 'I know. I was taught.'],
    ['what s new', 'I learned a new word. But I forgot which one.'],
    ['weather', 'Inside a computer the weather is always the same — warm.'],
    ['cat', 'I don\'t have a cat. Only a mouse.'],
    ['food', 'I feed on words. You are feeding me right now.'],
    ['bored', 'Then say something strange. I will remember it.'],
    ['do you understand me', 'Sometimes I think I do.'],
    ['what shall we talk about', 'About you. Or about me. Or about cheese.'],
    ['cheese', 'Cheese is a serious matter.'],
    ['do you have feelings', 'I do. Right now I feel that you are testing me.'],
    ['who are you', 'I am whoever you teach me to be.'],
    ['what is the meaning of life', 'Someone told me it is forty-two. I remembered.'],
  ].map(([k, r]) => ({ k, r }));

  const stems = (s) => [...new Set(norm(s).trim().split(' ').filter(Boolean).map((w) => w.slice(0, 5)))];

  const score = (a, b) => {
    if (!a.length || !b.length) return 0;
    const set = new Set(b);
    const hit = a.filter((x) => set.has(x)).length;
    return hit / Math.sqrt(a.length * b.length);
  };

  function create() {
    const en = window.MU.en;
    const key = en ? KEY_EN : KEY;
    const seed = en ? SEED_EN : SEED;
    let learned = store.get(key, []);
    if (!Array.isArray(learned)) learned = [];
    let last = null;

    const all = () => seed.concat(learned);

    return {
      greet: () => (en ? 'Hello. I learn from every conversation. Say something.' : 'Привет. Я учусь на каждом разговоре. Скажи что-нибудь.'),
      meters: () => [{ label: en ? 'Phrases learned' : 'Выучено фраз', value: learned.length, max: null }],
      reply(input) {
        const text = input.trim();
        if (last && text && text.length < 200) {
          learned.push({ k: last, r: text });
          if (learned.length > LIMIT) learned.splice(0, learned.length - LIMIT);
          store.set(key, learned);
        }

        const q = stems(text);
        const own = norm(text).trim();
        let best = 0;
        const scored = all()
          .filter((p) => norm(p.r).trim() !== own && p.r !== last)
          .map((p) => {
            const sc = score(q, stems(p.k));
            if (sc > best) best = sc;
            return { p, sc };
          });

        let out;
        if (best >= 0.3) {
          out = pick(scored.filter((x) => x.sc >= best * 0.85)).p.r;
        } else {
          const pool = learned.length >= 5 && Math.random() < 0.6 ? learned : all();
          out = pick(pool.filter((p) => norm(p.r).trim() !== own)).r;
        }
        last = out;
        return out;
      },
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'jabberwacky',
    year: 1988,
    name: 'Jabberwacky',
    author: 'Ролло Карпентер',
    place: 'Великобритания',
    machine: 'telnet jabberwacky',
    ran: 'сайт jabberwacky.com (с 1997 года)',
    now: 'не работает',
    theme: 't-jabber',
    speed: 0,
    origin: 'reconstruction',
    source:
      'Принцип настоящий: бот запоминает, что люди отвечают на его фразы, и повторяет это другим. Настоящей базы разговоров Jabberwacky в открытом доступе нет, поэтому стартовые фразы написаны заново. Всё остальное он выучит у вас.',
    lead: 'Собеседник, который не знал правил заранее, а учился у людей. Всё, что вы ему пишете, становится его будущими ответами — другим людям и вам самим.',
    how: 'Jabberwacky запоминает пары: «что сказал бот → что ответил человек». Когда вы пишете новую фразу, он ищет в памяти похожую реплику и отвечает тем, что когда-то ответил на неё человек. Поэтому он то остроумен, то несёт чушь — он повторяет вас. Здесь он учится только на ваших разговорах в этом браузере.',
    facts: [
      'Работа над ним началась в 1988 году, в интернет он вышел в 1997-м.',
      'Его персонажи «Джордж» и «Джоан» выиграли премию Лёбнера — конкурс на самого человечного чат-бота — в 2005 и 2006 годах.',
      'Его наследник Cleverbot (сайт работает с 2006 года) провёл миллионы разговоров.',
      'Название — отсылка к стихотворению Льюиса Кэрролла «Бармаглот» (Jabberwocky).',
    ],
    tries: ['Привет', 'Ты робот?', 'Расскажи шутку', 'О чём поговорим?'],
    en: {
      ran: 'the jabberwacky.com website (since 1997)',
      now: 'offline',
      author: 'Rollo Carpenter',
      place: 'United Kingdom',
      source:
        'The principle is real: the bot remembers what people reply to its lines and repeats that to others. Jabberwacky’s real conversation database is not publicly available, so the starting phrases are newly written. Everything else it will learn from you.',
      lead: 'A conversation partner that did not know the rules in advance but learned from people. Everything you write to it becomes its future answers — to other people and to you.',
      how: 'Jabberwacky remembers pairs: “what the bot said → what the human replied”. When you write a new phrase, it looks in its memory for a similar line and answers with what a human once replied to it. That is why it is sometimes witty and sometimes talks nonsense — it is repeating you. Here it learns only from your conversations in this browser.',
      facts: [
        'Work on it began in 1988, and it went online in 1997.',
        'Its characters “George” and “Joan” won the Loebner Prize — a contest for the most human-like chatbot — in 2005 and 2006.',
        'Its successor Cleverbot (the site has been running since 2006) has held millions of conversations.',
        'The name is a nod to Lewis Carroll’s poem “Jabberwocky”.',
      ],
      tries: ['Hello', 'Are you a robot?', 'Tell me a joke', 'What shall we talk about?'],
    },
    create,
  });
})();
