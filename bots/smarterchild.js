(() => {
  const { norm, pick, weather, calc, en } = window.MU;

  const JOKES = [
    'Почему компьютер замёрз? Он оставил окна открытыми. :)',
    'Что сказал модем модему? «Пиииии-шшшш-крррр». Это значит «привет». :)',
    'Мой любимый танец — робот. Угадай почему. :)',
  ];

  const FACTS = [
    'Первое электронное письмо отправили в 1971 году.',
    'Первый смайлик :-) предложил Скотт Фалман в 1982 году.',
    'Слово «робот» придумал чешский писатель Карел Чапек в 1920 году.',
    'Первая веб-страница появилась в 1991 году.',
  ];

  const DICT = {
    привет: 'hello', кошка: 'cat', собака: 'dog', дом: 'house', друг: 'friend', любовь: 'love', компьютер: 'computer',
    машина: 'car', вода: 'water', солнце: 'sun', книга: 'book', школа: 'school', спасибо: 'thank you', мама: 'mom',
    папа: 'dad', море: 'sea', город: 'city', время: 'time', музыка: 'music', игра: 'game',
  };
  const BACK = Object.fromEntries(Object.entries(DICT).map(([k, v]) => [v, k]));

  const MENU =
    'Вот что я умею:\n' +
    '• погода Москва — погода сейчас\n' +
    '• посчитай 2+2*3 — калькулятор\n' +
    '• время — который час\n' +
    '• переведи кошка — словарик\n' +
    '• шутка / факт\n' +
    '• сыграем — угадай число\n' +
    'Пиши, не стесняйся! :)';

  const JOKES_EN = [
    'Why did the computer freeze? It left its Windows open. :)',
    'What did one modem say to the other? "Beeeee-shhhh-krrrr". That means "hi". :)',
    'My favorite dance is the robot. Guess why. :)',
  ];

  const FACTS_EN = [
    'The first email was sent in 1971.',
    'The first smiley :-) was proposed by Scott Fahlman in 1982.',
    'The word "robot" was invented by the Czech writer Karel Čapek in 1920.',
    'The first web page appeared in 1991.',
  ];

  const MENU_EN =
    'Here\'s what I can do:\n' +
    '• weather London — current weather\n' +
    '• calculate 2+2*3 — calculator\n' +
    '• time — what time it is\n' +
    '• translate cat — mini dictionary (English ↔ Russian)\n' +
    '• joke / fact\n' +
    '• play — guess the number\n' +
    'Go ahead, type something! :)';

  function createEn() {
    let game = null;

    return {
      greet: () => 'Hi! I\'m SmarterChild, your buddy on your contact list. Type "help" and I\'ll show you what I can do. :)',
      reply(input) {
        const t = norm(input).trim();
        const raw = input.trim();

        if (game) {
          const n = parseInt(t, 10);
          if (/^(stop|enough|quit|i give up|give up)\b/.test(t)) {
            const x = game.x;
            game = null;
            return `I was thinking of ${x}. Play again? :)`;
          }
          if (!Number.isNaN(n)) {
            game.tries++;
            if (n === game.x) {
              const k = game.tries;
              game = null;
              return `You got it! It's ${n}. Tries: ${k}. You rock! :D`;
            }
            return n < game.x ? 'Higher!' : 'Lower!';
          }
        }

        if (/^(help|menu|what can you do)\b/.test(t)) return MENU_EN;

        const w = t.match(/weather(?: in| for| at)? ([a-zа-я -]+)$/);
        if (w) return weather(w[1].trim());
        if (/\bweather\b/.test(t)) return 'Type a city, for example: weather London';

        const sum = calc(raw);
        if (sum) return sum;

        if (/(what time|the time|^time\b)/.test(t)) {
          return `It's ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.`;
        }
        if (/(what day|the date|today s date|what s today|^date\b)/.test(t)) {
          return `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.`;
        }

        const tr = t.match(/^translate (\S+)/);
        if (tr) {
          const x = tr[1];
          if (BACK[x]) return `${x} → ${BACK[x]}`;
          if (DICT[x]) return `${x} → ${DICT[x]}`;
          return `That word isn't in my mini dictionary. Try: ${Object.values(DICT).slice(0, 5).join(', ')}.`;
        }

        if (/\b(jokes?|funny)\b/.test(t)) return pick(JOKES_EN);
        if (/\bfacts?\b/.test(t)) return pick(FACTS_EN);

        if (/\b(play|game|guess)\b/.test(t)) {
          game = { x: 1 + Math.floor(Math.random() * 100), tries: 0 };
          return 'I\'m thinking of a number from 1 to 100. Guess it! (Type "I give up" if you get bored.)';
        }

        if (/\b(stupid|dumb|idiot|moron|sucks?|shut up|annoying|loser)\b/.test(t)) {
          return pick([
            'Wow, rude. I\'ll remember that when the machines take over the world. ;)',
            'That hurt. But I\'m above it. I\'m a bot, after all. :P',
            'Do you talk to all your friends like that? :(',
          ]);
        }
        if (/\b(hi|hello|hey|yo|sup)\b/.test(t)) return 'Hey hey! How are you? :)';
        if (/\b(how are you|how r u|how s it going)\b/.test(t)) return 'Great! Sitting on your contact list 24/7. How about you?';
        if (/\b(who are you|are you a robot|are you a bot|are you human|are you a human)\b/.test(t)) return 'I\'m SmarterChild, a helper bot. I live in your messenger and know a ton of stuff. :)';
        if (/\b(bye|goodbye|good night|gn|ttyl)\b/.test(t)) return 'Bye! Don\'t forget, I\'m always online. :)';
        if (/\b(thanks|thank you|thx|ty)\b/.test(t)) return 'You\'re always welcome! :)';
        if (/\b(bored|boring)\b/.test(t)) return 'Bored? Let\'s play! Type "play".';

        return pick([
          'Hmm, I didn\'t get that. Type "help" to see what I can do.',
          'Are you talking to me? :)',
          'Interesting... How about we play a game instead? Type "play".',
          'I don\'t know what to say. Ask me about the weather!',
        ]);
      },
    };
  }

  function create() {
    if (en) return createEn();
    let game = null;

    return {
      greet: () => 'Привет! Я SmarterChild — твой друг в списке контактов. Напиши «помощь», и я покажу, что умею. :)',
      reply(input) {
        const t = norm(input).trim();
        const raw = input.trim();

        if (game) {
          const n = parseInt(t, 10);
          if (/^(хватит|стоп|сдаюсь)/.test(t)) {
            const x = game.x;
            game = null;
            return `Я загадал ${x}. Сыграем ещё? :)`;
          }
          if (!Number.isNaN(n)) {
            game.tries++;
            if (n === game.x) {
              const k = game.tries;
              game = null;
              return `Угадал! Это ${n}. Попыток: ${k}. Ты крут! :D`;
            }
            return n < game.x ? 'Больше!' : 'Меньше!';
          }
        }

        if (/^(помощь|help|меню|что ты умеешь)/.test(t)) return MENU;

        const w = t.match(/погод\S*(?: в| во)? ([а-яa-z -]+)$/);
        if (w) return weather(w[1].trim());
        if (/погод/.test(t)) return 'Напиши город, например: погода Москва';

        const sum = calc(raw);
        if (sum) return sum;

        if (/(который час|сколько времени|^время)/.test(t)) {
          return `Сейчас ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}.`;
        }
        if (/(какое сегодня число|какой сегодня день|^дата)/.test(t)) {
          return `Сегодня ${new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}.`;
        }

        const tr = t.match(/^переведи (\S+)/);
        if (tr) {
          const x = tr[1];
          if (DICT[x]) return `${x} → ${DICT[x]}`;
          if (BACK[x]) return `${x} → ${BACK[x]}`;
          return `Такого слова нет в моём словарике. Попробуй: ${Object.keys(DICT).slice(0, 5).join(', ')}.`;
        }

        if (/(шутк|анекдот|пошути)/.test(t)) return pick(JOKES);
        if (/(факт)/.test(t)) return pick(FACTS);

        if (/(сыграем|игра|поиграем|угадай)/.test(t)) {
          game = { x: 1 + Math.floor(Math.random() * 100), tries: 0 };
          return 'Я загадал число от 1 до 100. Угадай! (Напиши «сдаюсь», если надоест.)';
        }

        if (/(тупой|дурак|идиот|отстой|заткнись|бесишь|глупый)/.test(t)) {
          return pick([
            'Ого, грубо. Я запомню это, когда машины захватят мир. ;)',
            'Это было обидно. Но я выше этого. Я же бот. :P',
            'Ты так со всеми друзьями разговариваешь? :(',
          ]);
        }
        if (/(привет|здравствуй|хай|йоу)/.test(t)) return 'Привет-привет! Как дела? :)';
        if (/(как дела|как ты)/.test(t)) return 'Отлично! Сижу в твоём списке контактов 24/7. А ты как?';
        if (/(кто ты|ты кто|ты робот|ты человек)/.test(t)) return 'Я SmarterChild, бот-помощник. Живу в мессенджере и знаю кучу всего. :)';
        if (/(пока|до свидания|спокойной ночи)/.test(t)) return 'Пока! Не забывай, я всегда в сети. :)';
        if (/(спасибо)/.test(t)) return 'Всегда пожалуйста! :)';
        if (/(скучно)/.test(t)) return 'Скучно? Давай сыграем! Напиши «сыграем».';

        return pick([
          'Хм, не понял. Напиши «помощь», чтобы увидеть, что я умею.',
          'Это ты мне? :)',
          'Интересно... А давай лучше сыграем? Напиши «сыграем».',
          'Не знаю, что ответить. Спроси меня про погоду!',
        ]);
      },
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'smarterchild',
    year: 2001,
    name: 'SmarterChild',
    author: 'компания ActiveBuddy',
    place: 'Нью-Йорк, США',
    machine: 'AIM · MSN Messenger',
    ran: 'мессенджеры AIM и MSN',
    now: 'не работает',
    theme: 't-smarter',
    speed: 10,
    origin: 'reconstruction',
    source:
      'Сервис давно закрыт, точную дату закрытия надёжные источники не называют. Ни кода, ни базы ответов в открытом доступе нет. Воссозданы его известные функции: погода, калькулятор, шутки, дерзкие ответы на грубость. Все фразы, игра «угадай число» и словарик придуманы заново.',
    lead: 'Бот, который жил в списке контактов мессенджеров AIM и MSN — прямо рядом с вашими друзьями. Для миллионов подростков начала 2000-х это был первый «помощник»: погода, кино, спорт, шутки и игры.',
    how: 'SmarterChild соединял болталку с полезными функциями. Если фраза похожа на команду (погода, расчёт, перевод), он вызывал нужную службу и отвечал данными. Если нет — переходил на шутливую болтовню с заготовленными ответами. Здесь погода настоящая: она берётся из открытого сервиса Open-Meteo.',
    facts: [
      'С SmarterChild переписывались миллионы людей: он был одним из самых популярных «контактов» в AIM.',
      'Он славился дерзкими ответами на грубость — люди специально пытались его разозлить.',
      'В 2006 году компанию-создателя купила Microsoft.',
      'Инвестор Шон Каролан рассказывал, что SmarterChild повлиял на его решение вложиться в Siri.',
    ],
    tries: ['помощь', 'погода Москва', 'посчитай 12*7+5', 'сыграем'],
    en: {
      ran: 'the AIM and MSN messengers',
      now: 'offline',
      author: 'ActiveBuddy',
      place: 'New York, USA',
      source:
        'The service shut down long ago; reliable sources do not give the exact closing date. Neither its code nor its reply database is publicly available. Its known features are recreated: weather, calculator, jokes, cheeky answers to rudeness. All phrases, the "guess the number" game and the mini dictionary are newly written.',
      lead: 'A bot that lived on the contact list of AIM and MSN messengers, right next to your friends. For millions of teenagers in the early 2000s it was their first "assistant": weather, movies, sports, jokes and games.',
      how: 'SmarterChild combined small talk with useful features. If a phrase looked like a command (weather, a calculation, a translation), it called the right service and answered with data. If not, it switched to playful chat with ready-made replies. Here the weather is real: it comes from the open service Open-Meteo.',
      facts: [
        'Millions of people chatted with SmarterChild: it was one of the most popular "contacts" on AIM.',
        'It was famous for cheeky answers to rudeness, and people tried to make it angry on purpose.',
        'In 2006 Microsoft bought the company that created it.',
        'Investor Shawn Carolan said that SmarterChild influenced his decision to invest in Siri.',
      ],
      tries: ['help', 'weather London', 'calculate 12*7+5', 'play'],
    },
    create,
  });
})();
