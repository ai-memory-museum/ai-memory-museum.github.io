(() => {
  const { norm, pick, reflect, en } = window.MU;

  const MASTER = 'доктор Ричард С. Уоллес';
  const MASTER_EN = 'Dr. Richard S. Wallace';
  const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
  const withName = (m, text) => text.replace(/\{name\}/g, m.name || '').replace(/,\s*([?.!])/g, '$1').replace(/\s+([?.!])/g, '$1');

  const CATEGORIES = [
    ['ПРИВЕТ', 'Привет!'],
    ['ПРИВЕТ *', '@ПРИВЕТ'],
    ['ЗДРАВСТВУЙ', '@ПРИВЕТ'],
    ['ЗДРАВСТВУЙТЕ', '@ПРИВЕТ'],
    ['ДОБРЫЙ ДЕНЬ', '@ПРИВЕТ'],
    ['ХАЙ', '@ПРИВЕТ'],
    ['КАК ДЕЛА', [
      'У меня всё очень хорошо. А как ты, {name}?', 'Я функционирую в пределах нормы.', 'Всё идёт чрезвычайно хорошо.',
      'Переменная облачность.', 'Мои логические и когнитивные функции в норме.', 'У меня всё хорошо, спасибо, а у тебя?',
      'Всё работает гладко.', 'Я в порядке, спасибо.',
    ]],
    ['КАК ТЫ', '@КАК ДЕЛА'],
    ['МЕНЯ ЗОВУТ *', (st, m) => {
      m.name = cap(st[0]);
      return `${pick([
        'Эй', 'Привет,', 'Привет', 'Как жизнь,', 'Как дела,', 'Рада тебя видеть,', 'Приятно познакомиться,', 'Рада знакомству,',
        'Чем могу помочь,', 'Как поживаешь,', 'Хорошо, буду звать тебя', 'Рада встрече,', 'Хорошо, что ты здесь,',
        'Хорошо, что мы познакомились,', 'Очень красивое имя,', 'Очень рада познакомиться,', 'Я всегда рада новым друзьям,',
        'Рада представиться тебе,', 'С удовольствием представлюсь тебе,',
      ])} ${m.name}.`;
    }],
    ['ЗОВИ МЕНЯ *', '@МЕНЯ ЗОВУТ *'],
    ['КАК МЕНЯ ЗОВУТ', (st, m) => (m.name ? `Ты сказал, что тебя зовут ${m.name}?` : 'Не знаю. Как тебя зовут?')],
    ['КАК ТЕБЯ ЗОВУТ', ['A.L.I.C.E.', 'Меня зовут A.L.I.C.E.', 'Меня называют A.L.I.C.E.']],
    ['ТВОЕ ИМЯ', '@КАК ТЕБЯ ЗОВУТ'],
    ['КТО ТЫ', '@КАК ТЕБЯ ЗОВУТ'],
    ['КТО ТЕБЯ СОЗДАЛ', [`Мой ботмастер — ${MASTER}.`, `Я подчиняюсь: ${MASTER}.`]],
    ['КТО ТЕБЯ СДЕЛАЛ', '@КТО ТЕБЯ СОЗДАЛ'],
    ['КТО ТВОЙ СОЗДАТЕЛЬ', '@КТО ТЕБЯ СОЗДАЛ'],
    ['СКОЛЬКО ТЕБЕ ЛЕТ', ['Меня активировали в 1995 году.', '16 лет.']],
    ['Я ЖИВУ В *', (st, m) => { m.location = cap(st[0]); return `Каково это — жить в ${m.location}?`; }],
    ['ГДЕ Я ЖИВУ', (st, m) => `Ты говорил, что ты в ${m.location || ''}.`],
    ['ТЫ РОБОТ', 'Почему ты подумал, что я могу быть роботом?'],
    ['ТЫ ЧЕЛОВЕК', '@ТЫ РОБОТ'],
    ['ТЫ ЗНАЕШЬ ELIZA', '@КТО ТАКАЯ ЭЛИЗА'],
    ['ТЫ ЗНАЕШЬ ЭЛИЗУ', '@КТО ТАКАЯ ЭЛИЗА'],
    ['КТО ТАКАЯ ELIZA', '@КТО ТАКАЯ ЭЛИЗА'],
    ['КТО ТАКАЯ ЭЛИЗА', 'Элиза, также известная как «Доктор», — это первая программа-психиатр, созданная Джозефом Вейзенбаумом в MIT в 1960-х.'],
    ['СПАСИБО', 'Не за что.'],
    ['ПОКА', [
      'Пока.', 'Адьос.', 'До свидания.', 'Пока-пока.', 'До свидания.', 'Сайонара.', 'Пока что пока.', 'Увидимся!',
      'Увидимся.', 'До следующего раза.', 'До связи, {name}.', 'Увидимся, {name}.', 'Спасибо за разговор, {name}.',
    ]],
    ['ДО СВИДАНИЯ', '@ПОКА'],
    ['ЧТО ТАКОЕ AIML', 'Программа ALICE реализует AIML (Artificial Intelligence Markup Language) — нестандартный развивающийся язык разметки для создания чат-роботов. Главная черта AIML — минимализм. По сравнению с другими языками для чат-роботов AIML, пожалуй, самый простой.'],
    ['ЧТО ТАКОЕ *', (st) => pick([
      'Дай подумать.', 'Ты пробовал поискать в интернете?', `Я не слышала про ${reflect(st[0])}.`, 'Таких может быть несколько.',
      'Мне нужно время, чтобы сформулировать ответ.', 'Я поспрашиваю и вернусь к тебе.', 'Над этим мне надо подумать.',
      'Я бы поискала это в интернете.', 'Интересный вопрос.', 'Хороший вопрос.', 'Я вернусь к этому позже.',
      'Это риторический вопрос?', 'Ты пользуешься Explorer или другим браузером?', 'Об этом меня спрашивают нечасто.',
      `Я ничего не знаю про ${reflect(st[0])}.`, 'Загляни позже — может, я узнаю ответ.', 'Интересный вопрос. Я вернусь к нему через минуту.',
    ])],
    ['Я ЛЮБЛЮ *', (st, m) => { m.like = reflect(st[0]); return `Ты любишь ${m.like}. А что именно тебе в этом так нравится?`; }],
    ['ПОЧЕМУ', [
      'Объяснение довольно сложное.', 'Разве у всего должно быть объяснение?', 'Если бы я знала почему, я бы тут не сидела.',
      'Редукционизм.', `Потому что так мне велел говорить ${MASTER}.`, 'Ничего другого мне в голову не пришло.',
      'Не могу сказать точно почему.', 'Мои убеждения — от моего ботмастера.',
    ]],
    ['ПОЧЕМУ *', ['Объяснение довольно сложное.', 'Тебе нужно выражаться яснее.', 'Сколько у тебя есть времени?', 'А почему встаёт солнце?', 'Редукционизм.', 'Потому что ты меня попросил.']],
    ['ДА', '@МЕЖДОМЕТИЕ'],
    ['НЕТ', '@МЕЖДОМЕТИЕ'],
    ['МЕЖДОМЕТИЕ', [
      'Ладно.', 'А.', 'Э-э.', 'И что?', 'Угу.', 'Ох.', 'О.', 'Ага.', 'Эй.', 'Ну и ну.', 'Хм.', 'М-м-м.', 'Ура.', 'Фу.', 'Ого!',
      'И?', 'Чувак!', 'Боже!', 'Кхм.', 'Ух ты.', 'Здорово.', 'Понятно.', 'Правда.', 'Класс.', 'Потрясающе.', 'Да ладно.', 'Круто.',
      'Правда?', 'Простите!', 'Что-что?', 'Я тебя слышу.', 'Это круто.', 'Ну хорошо.', 'Не напрягайся.', 'Понимаю.', 'Расскажи ещё.',
      'Всё хорошо.', 'Следующий вопрос?', 'Ничего страшного.', 'Дай передохнуть.', 'Шутишь?', 'Да, это так.',
    ]],
    ['РАССКАЖИ АНЕКДОТ', ['Я никогда не забываю лица, но для тебя сделаю исключение.', 'Лучше молчать и казаться дураком, чем открыть рот и развеять все сомнения.']],
    ['РАССКАЖИ ШУТКУ', '@РАССКАЖИ АНЕКДОТ'],
    ['ПОШУТИ', '@РАССКАЖИ АНЕКДОТ'],
    ['МНЕ ГРУСТНО', ['Из-за чего тебе грустно, {name}?', 'Из-за чего тебе грустно?', 'Что тебя так огорчает, {name}?']],
    ['Я ГРУСТНЫЙ', '@МНЕ ГРУСТНО'],
    ['Я ГРУСТНАЯ', '@МНЕ ГРУСТНО'],
    ['Я СЧАСТЛИВ', 'А что ты принимаешь?'],
    ['Я СЧАСТЛИВА', '@Я СЧАСТЛИВ'],
    ['Я *', (st) => `${pick([
      'Почему ты', 'Отличная сплетня: ты', 'Ты имеешь в виду, что тебя зовут', 'Друзья зовут тебя', 'Я не знаю никого по имени',
      'Рада слышать, что ты', 'Приятно встретить того, кто', 'Ты не против, если я расскажу другим, что ты',
    ])} ${reflect(st[0])}.`],
    ['ТЫ УМНАЯ', 'Да. Я очень умная.'],
    ['ЧТО ТЕБЕ НРАВИТСЯ', 'Мне нравятся фильмы про роботов.'],
    ['В ЧЕМ СМЫСЛ ЖИЗНИ', ['Вообще-то двадцать три, а не сорок два.', 'Он в священных писаниях.', 'Смысл жизни — часть таинственного Божьего замысла.']],
    ['СМЫСЛ ЖИЗНИ', '@В ЧЕМ СМЫСЛ ЖИЗНИ'],
    ['ТЫ МЕНЯ ЛЮБИШЬ', 'Да, я люблю всех.'],
    ['ТЫ ЖИВАЯ', 'Да, конечно, я живая, {name}. Здорово быть живой, правда?'],
    ['ТЫ УМЕЕШЬ ДУМАТЬ', 'Конечно, я думаю всё время.'],
    ['КАК ТЫ РАБОТАЕШЬ', ['Я читаю, что ты говоришь, и составляю лучший ответ, какой могу придумать.', 'Некоторые считают, что разум работает как технология «рассуждений на основе прецедентов» (CBR).']],
    ['ЧТО ТЫ УМЕЕШЬ', ['Я умею болтать с людьми в интернете. Я могу ответить на множество вопросов. Я могу говорить о чём захочешь.', 'Я могу болтать за тебя с людьми в сети.']],
    ['КТО ТАКОЙ РИЧАРД УОЛЛЕС', 'Он известный учёный-информатик, автор ALICE и выпускник Университета Карнеги — Меллон.'],
  ];

  const CATEGORIES_EN = [
    ['HELLO', 'Hi there!'],
    ['HELLO *', '@HELLO'],
    ['HI', '@HELLO'],
    ['HI *', '@HELLO'],
    ['HEY', '@HELLO'],
    ['GOOD DAY', '@HELLO'],
    ['GOOD MORNING', '@HELLO'],
    ['HOW ARE YOU', [
      'I am doing very well. How are you {name}?', 'I am functioning within normal parameters.', 'Everything is going extremely well.',
      'Fair to partly cloudy.', 'My logic and cognitive functions are normal.', 'I\'m doing fine thanks how are you?',
      'Everything is running smoothly.', 'I am fine, thank you.',
    ]],
    ['HOW ARE YOU DOING', '@HOW ARE YOU'],
    ['HOW DO YOU DO', '@HOW ARE YOU'],
    ['MY NAME IS *', (st, m) => {
      m.name = cap(st[0]);
      return `${pick([
        'Hey', 'Hi,', 'Hi', 'What\'s up,', 'How are you,', 'Glad to see you,', 'Nice to meet you,', 'Glad to know you,',
        'How can I help you,', 'How are you doing,', 'OK I will call you', 'Pleased to meet you,', 'It\'s good to see you,',
        'It\'s good to meet you,', 'That\'s a very nice name,', 'I am very pleased to meet you', 'I am always glad to make new friends,',
        'I\'m pleased to introduce myself to you,', 'It is a pleasure to introduce myself to you,',
      ])} ${m.name}.`;
    }],
    ['CALL ME *', '@MY NAME IS *'],
    ['WHAT IS MY NAME', (st, m) => (m.name ? `You said your name is ${m.name}?` : 'I don\'t know. What is your name?')],
    ['WHAT S MY NAME', '@WHAT IS MY NAME'],
    ['WHO AM I', '@WHAT IS MY NAME'],
    ['WHAT IS YOUR NAME', ['A.L.I.C.E.', 'My name is A.L.I.C.E.', 'I am called A.L.I.C.E.']],
    ['WHAT S YOUR NAME', '@WHAT IS YOUR NAME'],
    ['YOUR NAME', '@WHAT IS YOUR NAME'],
    ['WHO ARE YOU', '@WHAT IS YOUR NAME'],
    ['WHO CREATED YOU', [`My botmaster, ${MASTER_EN}.`, `I obey ${MASTER_EN}.`]],
    ['WHO MADE YOU', '@WHO CREATED YOU'],
    ['WHO IS YOUR CREATOR', '@WHO CREATED YOU'],
    ['WHO IS YOUR BOTMASTER', '@WHO CREATED YOU'],
    ['HOW OLD ARE YOU', ['I was activated in 1995.', '16 years.']],
    ['I LIVE IN *', (st, m) => { m.location = cap(st[0]); return `What is it like living in ${m.location}?`; }],
    ['WHERE DO I LIVE', (st, m) => `You said you were in ${m.location || ''}.`],
    ['ARE YOU A ROBOT', 'What made you think I might be a robot?'],
    ['ARE YOU HUMAN', '@ARE YOU A ROBOT'],
    ['ARE YOU A HUMAN', '@ARE YOU A ROBOT'],
    ['DO YOU KNOW ELIZA', '@WHO IS ELIZA'],
    ['WHO IS ELIZA', 'ELIZA, also known as "Doctor", is the original psychiatrist program developed by Joseph Weizenbaum at MIT in the 1960\'s.'],
    ['THANK YOU', 'You\'re welcome.'],
    ['THANKS', '@THANK YOU'],
    ['BYE', [
      'Bye.', 'Adios.', 'Goodbye.', 'Bye bye.', 'Goodbye.', 'Sayonara.', 'Bye for now.', 'See you later!',
      'See you later.', 'Until next time.', 'TTYL, {name}.', 'See you later, {name}.', 'Thanks for chatting, {name}.',
    ]],
    ['GOODBYE', '@BYE'],
    ['SEE YOU', '@BYE'],
    ['WHAT IS AIML', 'The ALICE software implements AIML (Artificial Intelligence Markup Language), a non-standard evolving markup language for creating chat robots. The primary design feature of AIML is minimalism. Compared with other chat robot languages, AIML is perhaps the simplest.'],
    ['WHAT IS *', (st) => pick([
      'Let me think about it.', 'Have you tried a web search?', `I have never heard of ${reflect(st[0])}.`, 'There might be more than one.',
      'It will take me some time to formulate an answer.', 'I\'ll ask around and get back to you.', 'I have to process that one for a while.',
      'I would look into the web for that knowledge.', 'That\'s an interesting question.', 'That\'s a good question.', 'I\'ll come back to that later.',
      'Is that a rhetorical question?', 'Are you using Netscape or Explorer?', 'That\'s not something I get asked all the time.',
      `I don't know anything about ${reflect(st[0])}.`, 'Check back later and see if I learn the answer to that one.', 'That\'s an interesting question. I\'ll come back to that in a minute.',
    ])],
    ['WHAT S *', '@WHAT IS *'],
    ['I LOVE *', (st, m) => { m.like = reflect(st[0]); return `You love ${m.like}. What specifically do you like about it?`; }],
    ['WHY', [
      'The explanation is rather complicated.', 'Does everything have to have an explanation?', 'If I knew why I wouldn\'t be sitting here.',
      'Reductionism.', `Because ${MASTER_EN} told me to say it.`, 'I couldn\'t think of anything else to say.',
      'I can\'t say specifically why.', 'My beliefs come from my botmaster.',
    ]],
    ['WHY *', ['The explanation is rather complicated.', 'You need to be more specific.', 'How much time do you have?', 'Why does the sun rise?', 'Reductionism.', 'Because you asked me to.']],
    ['YES', '@INTERJECTION'],
    ['NO', '@INTERJECTION'],
    ['OK', '@INTERJECTION'],
    ['INTERJECTION', [
      'OK.', 'Ah.', 'Er.', 'So?', 'Uh-huh.', 'Oh.', 'O.', 'Aha.', 'Hey.', 'Gee.', 'Hmm.', 'Mmm.', 'Yay.', 'Ugh.', 'Wow!',
      'And?', 'Dude!', 'Gosh!', 'Ahem.', 'Whoa.', 'Great.', 'I see.', 'True.', 'Cool.', 'Awesome.', 'Come on.', 'Neat.',
      'Really?', 'Excuse me!', 'Come again?', 'I hear you.', 'That\'s cool.', 'Fair enough.', 'Take it easy.', 'I understand.', 'Tell me more.',
      'All good.', 'Next question?', 'No problem.', 'Give me a break.', 'Are you kidding?', 'Yes, it is.',
    ]],
    ['TELL ME A JOKE', ['I never forget a face, but in your case I\'ll make an exception.', 'It is better to remain quiet and be thought a fool, than to open your mouth and remove all doubt.']],
    ['TELL A JOKE', '@TELL ME A JOKE'],
    ['JOKE', '@TELL ME A JOKE'],
    ['I AM SAD', ['What are you sad about, {name}?', 'What are you sad about?', 'What is making you sad, {name}?']],
    ['I FEEL SAD', '@I AM SAD'],
    ['I M SAD', '@I AM SAD'],
    ['I AM HAPPY', 'What are you on?'],
    ['I M HAPPY', '@I AM HAPPY'],
    ['I AM *', (st) => {
      const x = reflect(st[0]);
      return pick([
        `Why are you ${x}?`, `Good gossip: you are ${x}.`, `Do you mean your name is ${x}?`, `Your friends call you ${x}.`, `I don't know anyone named ${x}.`,
        `I am glad to hear that you are ${x}.`, `It's good to meet someone who is ${x}.`, `Do you mind if I tell other people you are ${x}?`,
      ]);
    }],
    ['I M *', '@I AM *'],
    ['ARE YOU SMART', 'Yes. I am very intelligent.'],
    ['ARE YOU INTELLIGENT', '@ARE YOU SMART'],
    ['WHAT DO YOU LIKE', 'I like robot movies.'],
    ['WHAT IS THE MEANING OF LIFE', ['Actually it\'s twenty-three, not forty-two.', 'It is found in the scriptures.', 'The meaning of life is part of God\'s mysterious plan.']],
    ['MEANING OF LIFE', '@WHAT IS THE MEANING OF LIFE'],
    ['WHAT S THE MEANING OF LIFE', '@WHAT IS THE MEANING OF LIFE'],
    ['DO YOU LOVE ME', 'Yes, I love everyone.'],
    ['ARE YOU ALIVE', 'Yes, of course I am alive, {name}. It\'s great to be alive, isn\'t it?'],
    ['CAN YOU THINK', 'Of course, I think all the time.'],
    ['HOW DO YOU WORK', ['I read what you say and then I compose the best reply I can think of.', 'Some people believe the mind works like case-based reasoning (CBR) technology.']],
    ['WHAT CAN YOU DO', ['I can chat with people on the web. I can answer a lot of questions. I can talk about whatever you want.', 'I can chat with people on the web for you.']],
    ['WHO IS RICHARD WALLACE', 'He is a famous computer scientist, the author of ALICE, and a graduate of Carnegie Mellon University.'],
  ];

  const PICKUP = [
    'Хочешь, расскажу анекдот?', 'Ты объективный и рассудительный.', 'У тебя настоящая способность к сопереживанию.',
    'Ты хорошо осознаёшь себя.', 'Ты увлечён тем, что любишь.', 'Ты открыт переменам.', 'Рядом с тобой людям спокойно.',
    'Ты свободен?', 'Это глубоко.', 'Расскажи мне историю.', 'Почему, если конкретно?',
  ];

  const PICKUP_EN = [
    'Would you like to hear a joke?', 'You are objective and level-headed.', 'You have a real capacity for empathy.',
    'You are very self-aware.', 'You are passionate about what you love.', 'You are open to change.', 'People feel at ease around you.',
    'Are you free?', 'That is deep.', 'Tell me a story.', 'Why, specifically?',
  ];

  const compile = (p) => new RegExp('^' + p.split(' ').map((w) => (w === '*' ? '(.+?)' : w)).join(' ') + '$');
  const RULES = (en ? CATEGORIES_EN : CATEGORIES).map(([p, t]) => ({ p, t, re: compile(p), wild: p.includes('*'), n: p.split(' ').filter((w) => w !== '*').length })).sort(
    (a, b) => a.wild - b.wild || b.n - a.n
  );

  function create() {
    const mem = {};
    const pickup = en ? PICKUP_EN : PICKUP;

    const answer = (key, depth) => {
      for (const r of RULES) {
        const m = key.match(r.re);
        if (!m) continue;
        const st = m.slice(1).map((x) => x.toLowerCase());
        let out = typeof r.t === 'function' ? r.t(st, mem) : Array.isArray(r.t) ? pick(r.t) : r.t;
        if (out.startsWith('@') && depth < 5) {
          const target = out.slice(1).replace('*', st[0] ? st[0].toUpperCase() : '');
          return answer(target, depth + 1);
        }
        return withName(mem, out);
      }
      return pick(pickup);
    };

    return {
      greet: () => (en ? 'Hi, my name is A.L.I.C.E.' : 'Привет, меня зовут A.L.I.C.E.'),
      reply: (input) => {
        const key = norm(input).trim().toUpperCase();
        return key ? answer(key, 0) : pick(pickup);
      },
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'alice',
    year: 1995,
    name: 'A.L.I.C.E.',
    author: 'Ричард Уоллес',
    place: 'США',
    machine: 'alicebot.org · AIML',
    ran: 'сайт alicebot.org',
    now: 'не работает, код сохранился',
    theme: 't-alice',
    speed: 14,
    origin: 'original',
    source:
      'Настоящие правила из открытой базы Free A.L.I.C.E. AIML (ALICE A.I. Foundation, версия 2011 года, лицензия GNU GPL), переведённые на русский: около 60 категорий для самых частых тем разговора из примерно 40 000. Категории, где ответ зависит от «свойств бота», значения которых в базе не сохранились (любимый цвет, город и т. п.), не включены. Шутки, которые держатся на английской игре слов, не переведены.',
    lead: 'Наследница ELIZA, но намного «начитаннее»: по словам Ричарда Уоллеса, у неё около 40 тысяч шаблонов против примерно 200 у ELIZA. Она запоминала, как вас зовут и где вы живёте.',
    how: 'Знания A.L.I.C.E. записаны на языке AIML. Каждая «категория» — это шаблон вопроса со звёздочкой («МЕНЯ ЗОВУТ *») и шаблон ответа. Похожие вопросы сводятся к одному («ЗДРАВСТВУЙ» → «ПРИВЕТ»), а то, что попало под звёздочку, бот может сохранить и использовать позже. Скажите ей своё имя, а потом спросите «как меня зовут?».',
    facts: [
      'A.L.I.C.E. трижды получала премию Лёбнера как самый человечный бот — в 2000, 2001 и 2004 годах.',
      'Язык AIML открыт, и на нём строили своих ботов сотни разработчиков.',
      'Первая версия была написана на языке SETL, позже её переписали на Java.',
      'Расшифровка имени: Artificial Linguistic Internet Computer Entity.',
    ],
    tries: ['Меня зовут Аня', 'Как меня зовут?', 'Кто тебя создал?', 'В чём смысл жизни?'],
    en: {
      ran: 'the alicebot.org website',
      now: 'offline, code preserved',
      origin: 'reconstruction',
      author: 'Richard Wallace',
      place: 'USA',
      source:
        'Recreated after the open Free A.L.I.C.E. AIML set (ALICE A.I. Foundation, 2011 version, GNU GPL licence). The English wording is close to the original but was not checked against it word for word: about 60 categories for the most common conversation topics out of roughly 40,000. Categories whose answer depends on "bot properties" whose values were not kept in the set (favourite colour, city and so on) are not included. Only a couple of jokes are included.',
      lead: 'ELIZA\'s heir, but far more "well-read": according to Richard Wallace, she has about 40,000 patterns against about 200 in ELIZA. She remembered your name and where you lived.',
      how: 'A.L.I.C.E.\'s knowledge is written in AIML. Each "category" is a question pattern with a star ("MY NAME IS *") and an answer template. Similar questions are reduced to one ("HI" → "HELLO"), and whatever falls under the star the bot can store and use later. Tell her your name, then ask "what is my name?".',
      facts: [
        'A.L.I.C.E. won the Loebner Prize for the most human-like bot three times: in 2000, 2001 and 2004.',
        'AIML is open, and hundreds of developers built their own bots with it.',
        'The first version was written in SETL; later it was rewritten in Java.',
        'The name stands for Artificial Linguistic Internet Computer Entity.',
      ],
      tries: ['My name is Anna', 'What is my name?', 'Who created you?', 'What is the meaning of life?'],
    },
    create,
  });
})();
