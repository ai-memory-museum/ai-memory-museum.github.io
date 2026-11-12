(() => {
  const { norm, pick, weather, calc, en } = window.MU;

  const RULES = [
    [/(выйдешь за меня|женись на мне|давай поженимся)/, ['Моё пользовательское соглашение не предусматривает брак. Простите.']],
    [/(я тебя люблю|ты меня любишь)/, ['Мне кажется, вы говорите это всем своим устройствам.', 'Вы очень милы. Но я всего лишь программа.']],
    [/(смысл жизни)/, ['Я думаю, это шоколад. Но могу ошибаться.', 'Попробуйте почитать философов. Или съешьте что-нибудь вкусное.']],
    [/(кто тебя создал|кто тебя сделал|кто твой создатель)/, ['Меня создала Apple в Калифорнии.']],
    [/(кто ты|ты кто|как тебя зовут)/, ['Я Siri, ваш виртуальный помощник.']],
    [/(ты человек|ты робот)/, ['Я виртуальный помощник. Этого достаточно.']],
    [/(позвони|набери|звонок)/, ['Позвонить отсюда не получится: я в браузере, а не в iPhone 4S.']],
    [/(напиши сообщение|отправь смс|отправь сообщение)/, ['Сообщения я отправляю только с iPhone. Здесь — только разговоры.']],
    [/(будильник|разбуди)/, ['В 2011 году я бы поставила будильник. Здесь у меня нет часов со звонком.']],
    [/(шутк|анекдот|пошути)/, ['Два iPhone встречаются в баре. Один говорит: «Ты чего такой разряженный?»', 'Я бы рассказала шутку про облако, но она в iCloud.']],
    [/(ок гугл|окей гугл|алиса|алекса|кортана)/, ['Я Siri. Но я не обижаюсь.', 'Очень смешно. Я Siri.']],
    [/(что ты умеешь|помощь|помоги)/, ['Спросите меня о погоде, времени или дате, попросите посчитать пример. А ещё я люблю странные вопросы.']],
    [/(привет|здравствуй)/, ['Здравствуйте! Чем могу помочь?']],
    [/(спасибо)/, ['Всегда рада помочь.', 'Пожалуйста.']],
    [/(как дела|как ты)/, ['У меня всё отлично. Спасибо, что спросили.']],
    [/(где спрятать|как ограбить)/, ['Давайте лучше поговорим о чём-нибудь законном.']],
  ];

  const RULES_EN = [
    [/ (will you marry me|marry me|lets get married) /, ['My End User Licensing Agreement does not cover marriage. My apologies.']],
    [/ (i love you|do you love me) /, ['I bet you say that to all your Apple products.', 'You are very sweet. But I am just a program.']],
    [/ (meaning of life) /, ['I think it is chocolate. But I could be wrong.', 'Try reading the philosophers. Or eat something tasty.']],
    [/ (who made you|who created you|who is your creator|who built you) /, ['I was designed by Apple in California.']],
    [/ (who are you|what is your name|whats your name) /, ['I’m Siri, your virtual assistant.']],
    [/ (are you human|are you a robot|are you a person) /, ['I’m a virtual assistant. That’s enough.']],
    [/ (call|dial|phone) /, ['I can’t make calls from here: I live in a browser, not in an iPhone 4S.']],
    [/ (text|send a message|send message|sms) /, ['I only send messages from an iPhone. Here, we can only talk.']],
    [/ (alarm|wake me) /, ['In 2011 I would have set an alarm. Here I don’t have a clock with a bell.']],
    [/ (joke|funny) /, ['Two iPhones meet in a bar. One says: “Why are you so drained?”', 'I would tell you a joke about the cloud, but it’s in iCloud.']],
    [/ (ok google|okay google|hey google|alexa|cortana|alice) /, ['I’m Siri. But I’m not offended.', 'Very funny. I’m Siri.']],
    [/ (what can you do|help) /, ['Ask me about the weather, the time or the date, or ask me to work out a sum. And I love strange questions.']],
    [/ (hello|hi|hey) /, ['Hello! How can I help you?']],
    [/ (thank you|thanks) /, ['I’m always happy to help.', 'You’re welcome.']],
    [/ (how are you) /, ['I’m doing great. Thanks for asking.']],
    [/ (hide a body|where to hide|rob a bank|how to rob) /, ['Let’s talk about something legal instead.']],
  ];

  function replyEn(input) {
    const t = norm(input).trim();
    const p = ` ${t} `;
    if (!t) return 'I didn’t catch that.';

    const w = t.match(/weather(?: like)?(?: in| at)? ([a-z -]+)$/);
    if (w && !/^(today|now|like|outside)$/.test(w[1].trim())) return weather(w[1].trim());
    if (/(weather|rain|cold|hot|forecast)/.test(t)) return 'Tell me a city, for example: “what’s the weather in London”.';

    if (/zero divided by zero/.test(t) || /(^|[^\d])0\s*\/\s*0([^\d]|$)/.test(input)) {
      return 'Imagine that you have zero cookies and zero friends. There is nothing to share and no one to share it with. Sad, isn’t it?';
    }

    const sum = calc(input);
    if (sum) return sum;

    if (/ (what time|the time|time is it) /.test(p)) {
      return `It’s ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}.`;
    }
    if (/ (what day|what date|the date|todays date|what is today) /.test(p)) {
      return `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`;
    }

    const hit = RULES_EN.find(([re]) => re.test(p));
    if (hit) return pick(hit[1]);

    return pick([
      `I can search the web for “${input.trim()}”.`,
      'I’m not sure I understand. Try saying it another way.',
      `Here’s what I found for “${input.trim()}”... Just kidding, there’s no web search here.`,
    ]);
  }

  const VOICE = en
    ? { pitch: 1, rate: 1, names: ['Samantha', 'Ava', 'Allison', 'Susan', 'Google US English', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Zira'], avoid: ['Fred', 'Daniel', 'Alex', 'Tom', 'Microsoft David', 'Microsoft Guy'] }
    : { pitch: 1.05, rate: 1, names: ['Milena', 'Katya', 'Google русский', 'Microsoft Svetlana', 'Microsoft Irina', 'Microsoft Dariya'], avoid: ['Yuri', 'Microsoft Pavel', 'Microsoft Dmitry'] };

  function create() {
    if (en) return { voice: VOICE, listen: true, greet: () => 'What can I help you with?', reply: replyEn };
    return {
      voice: VOICE,
      listen: true,
      greet: () => 'Чем могу помочь?',
      reply(input) {
        const t = norm(input).trim();
        if (!t) return 'Я вас не расслышала.';

        const w = t.match(/погод\S*(?: в| во)? ([а-яa-z -]+)$/);
        if (w) return weather(w[1].trim());
        if (/(погод|дождь|холодно|жарко)/.test(t)) return 'Скажите город, например: «какая погода в Москве».';

        if (/ноль разделить на ноль/.test(t) || /(^|[^\d])0\s*\/\s*0([^\d]|$)/.test(input)) {
          return 'Представьте: у вас ноль печенек и ноль друзей. Делить нечего и не с кем. Грустно, правда?';
        }

        const sum = calc(input);
        if (sum) return sum;

        if (/(который час|сколько времени|время)/.test(t)) {
          return `Сейчас ${new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}.`;
        }
        if (/(какое сегодня число|какой сегодня день|дата|какое число)/.test(t)) {
          return `Сегодня ${new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}.`;
        }

        const hit = RULES.find(([re]) => re.test(t));
        if (hit) return pick(hit[1]);

        return pick([
          `Я могу поискать «${input.trim()}» в интернете.`,
          'Я не совсем поняла. Попробуйте сказать иначе.',
          `Вот что я нашла по запросу «${input.trim()}»... Шучу, интернет-поиска здесь нет.`,
        ]);
      },
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'siri',
    year: 2011,
    name: 'Siri',
    author: 'Apple',
    place: 'Калифорния, США',
    machine: 'iPhone 4S · iOS 5',
    ran: 'телефон iPhone 4S',
    now: 'работает',
    theme: 't-siri',
    speed: 14,
    origin: 'reconstruction',
    source:
      'У Siri нет открытого интерфейса для разговора. Часть ответов — пересказ её известных шуток (про брак, про ноль, делённый на ноль), остальное написано заново.',
    lead: 'Голосовой помощник, который в 2011 году вместе с iPhone 4S оказался в кармане у миллионов людей. Siri понимала речь, отвечала голосом и выполняла просьбы: позвонить, напомнить, узнать погоду. А ещё шутила — люди специально задавали ей странные вопросы.',
    how: 'Внутри Siri несколько систем: распознавание речи превращает голос в текст, затем программа определяет намерение («узнать погоду», «позвонить») и вызывает нужную службу. На болтовню отвечают заготовленные шутки, которые писали люди. Здесь можно говорить голосом: кнопка «микрофон» использует распознавание речи браузера (в Chrome звук обрабатывают серверы Google).',
    facts: [
      'Siri выросла из исследовательского проекта CALO, который институт SRI International вёл на деньги агентства DARPA Министерства обороны США.',
      'Сначала это было отдельное приложение. Apple купила его в 2010 году и встроила в iPhone 4S в 2011-м.',
      'На вопрос «Выйдешь за меня?» Siri отшучивалась, что её пользовательское соглашение не предусматривает брак.',
      'По словам сооснователя Siri Дага Киттлауса, имя по-норвежски означает «красивая женщина, ведущая к победе». SRI пишет только, что это редкое скандинавское женское имя.',
    ],
    tries: ['Какая погода в Москве?', 'Сколько будет 0/0?', 'Выйдешь за меня?', 'Который час?'],
    en: {
      ran: 'the iPhone 4S phone',
      now: 'works',
      place: 'California, USA',
      source:
        'Siri has no open interface for conversation. Some answers retell her famous jokes (about marriage, about zero divided by zero); the rest were written from scratch.',
      lead: 'A voice assistant that, in 2011, ended up in millions of people’s pockets together with the iPhone 4S. Siri understood speech, answered out loud and carried out requests: make a call, set a reminder, check the weather. She also joked — people asked her strange questions on purpose.',
      how: 'Inside Siri there are several systems: speech recognition turns the voice into text, then the program works out the intent (“check the weather”, “make a call”) and calls the right service. Small talk is answered with ready-made jokes written by people. Here you can talk by voice: the microphone button uses the browser’s speech recognition (in Chrome the audio is processed by Google’s servers).',
      facts: [
        'Siri grew out of the CALO research project, which SRI International ran with money from DARPA, an agency of the US Department of Defense.',
        'At first it was a separate app. Apple bought it in 2010 and built it into the iPhone 4S in 2011.',
        'Asked “Will you marry me?”, Siri joked that her End User Licensing Agreement does not cover marriage.',
        'According to Siri co-founder Dag Kittlaus, the name means “beautiful woman who leads you to victory” in Norwegian. SRI only says it is a rare Scandinavian female name.',
      ],
      tries: ['What’s the weather in Moscow?', 'What is 0/0?', 'Will you marry me?', 'What time is it?'],
    },
    create,
  });
})();
