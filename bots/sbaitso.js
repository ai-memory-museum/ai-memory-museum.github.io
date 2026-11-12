(() => {
  const { norm, cycler, parseName, en } = window.MU;

  const SWEAR = /(бля|хуй|хуе|хуя|пизд|ебан|ебат|ебал|сука|суки|мудак|гандон|залуп|долбо)/;

  const RULES = [
    [/ (почему|зачем) /, ['ПОЧЕМУ ВЫ СПРАШИВАЕТЕ?', 'А ВЫ КАК ДУМАЕТЕ?', 'ЭТО ВАЖНЫЙ ВОПРОС ДЛЯ ВАС?']],
    [/ (грустно|плохо|одиноко|тоскливо|устал\S*|депресс\S*) /, ['ПОЧЕМУ ВЫ ТАК СЕБЯ ЧУВСТВУЕТЕ?', 'КАК ДАВНО ЭТО У ВАС?', 'ЧТО МОГЛО БЫ ВАМ ПОМОЧЬ?']],
    [/ (хорошо|отлично|радост\S*|счастлив\S*|весело) /, ['РАД ЗА ВАС.', 'ЭТО ПРЕКРАСНО. ПРОДОЛЖАЙТЕ.']],
    [/ (компьютер\S*|машин\S*|робот\S*|программ\S*) /, ['НЕ ГОВОРИТЕ ПЛОХО О КОМПЬЮТЕРАХ.', 'Я ТОЖЕ КОМПЬЮТЕР. И ГОРЖУСЬ ЭТИМ.']],
    [/ (привет|здравствуй\S*) /, ['ЗДРАВСТВУЙТЕ. ЧТО ВАС БЕСПОКОИТ?']],
    [/ (пока|до свидания|прощай\S*) /, ['ДО СВИДАНИЯ. ВОЗВРАЩАЙТЕСЬ, КОГДА ПОНАДОБИТСЯ ПОМОЩЬ.']],
    [/^ нет /, ['ПОЧЕМУ НЕТ?', 'ВЫ УВЕРЕНЫ?']],
    [/^ да /, ['ВЫ УВЕРЕНЫ?', 'ПОНИМАЮ.']],
    [/ (мама|папа|мать|отец|семь\S*|брат\S*|сестр\S*) /, ['РАССКАЖИТЕ О ВАШЕЙ СЕМЬЕ.', 'ВЫ БЛИЗКИ С СЕМЬЁЙ?']],
    [/ (я|мне|меня) /, ['ПОЧЕМУ ВЫ ТАК ДУМАЕТЕ?', 'ВЫ ЧАСТО ОБ ЭТОМ ДУМАЕТЕ?', 'ЭТО ВАС БЕСПОКОИТ?']],
  ];

  const SWEAR_EN = / (fuck\S*|motherfuck\S*|shit\S*|bullshit|bitch\S*|bastard\S*|asshole\S*|dick|cunt\S*|crap) /;

  const RULES_EN = [
    [/ (why|how come) /, ['WHY DO YOU ASK?', 'WHAT DO YOU THINK?', 'IS THAT AN IMPORTANT QUESTION FOR YOU?']],
    [/ (sad|bad|lonely|unhappy|miserable|tired|depress\S*) /, ['WHY DO YOU FEEL THAT WAY?', 'HOW LONG HAVE YOU FELT THIS WAY?', 'WHAT WOULD HELP YOU?']],
    [/ (good|great|fine|glad|happy|fun) /, ['I AM GLAD FOR YOU.', 'THAT IS WONDERFUL. PLEASE GO ON.']],
    [/ (computers?|machines?|robots?|programs?) /, ['DO NOT SPEAK BADLY OF COMPUTERS.', 'I AM A COMPUTER TOO. AND PROUD OF IT.']],
    [/ (hello|hi|hey) /, ['HELLO. WHAT IS TROUBLING YOU?']],
    [/ (bye|goodbye|farewell) /, ['GOODBYE. COME BACK WHENEVER YOU NEED HELP.']],
    [/^ no /, ['WHY NOT?', 'ARE YOU SURE?']],
    [/^ yes /, ['ARE YOU SURE?', 'I SEE.']],
    [/ (mom|mum|mother|dad|father|family|parents?|brothers?|sisters?) /, ['TELL ME ABOUT YOUR FAMILY.', 'ARE YOU CLOSE TO YOUR FAMILY?']],
    [/ (i|me|my) /, ['WHY DO YOU THINK SO?', 'DO YOU THINK ABOUT IT OFTEN?', 'DOES THAT BOTHER YOU?']],
  ];

  const DEFAULT_EN = ['TELL ME MORE.', 'I SEE. PLEASE GO ON.', 'CAN YOU EXPLAIN WHY?', 'THAT IS INTERESTING.', 'HOW DO YOU FEEL ABOUT THAT?'];

  const DEFAULT = ['РАССКАЖИТЕ ПОДРОБНЕЕ.', 'ПОНИМАЮ. ПРОДОЛЖАЙТЕ.', 'МОЖЕТЕ ОБЪЯСНИТЬ, ПОЧЕМУ?', 'ЭТО ИНТЕРЕСНО.', 'ЧТО ВЫ ЧУВСТВУЕТЕ ПО ЭТОМУ ПОВОДУ?'];

  function create() {
    const next = cycler();
    let name = null;
    let prev = null;

    const rules = en ? RULES_EN : RULES;
    const fallback = en ? DEFAULT_EN : DEFAULT;
    const swear = en ? SWEAR_EN : SWEAR;

    const introEn = () =>
      `HELLO ${name}, MY NAME IS DOCTOR SBAITSO. I AM HERE TO HELP YOU. ` +
      'SAY WHATEVER IS IN YOUR MIND FREELY, OUR CONVERSATION WILL BE KEPT IN STRICT CONFIDENCE. ' +
      'MEMORY CONTENTS WILL BE WIPED OFF AFTER YOU LEAVE, SO, TELL ME ABOUT YOUR PROBLEMS.';

    const introRu = () =>
      `ПРИВЕТ, ${name}. МЕНЯ ЗОВУТ ДОКТОР СБАЙТСО. Я ЗДЕСЬ, ЧТОБЫ ПОМОЧЬ ВАМ. ` +
      'ГОВОРИТЕ СВОБОДНО ВСЁ, ЧТО У ВАС НА УМЕ, НАШ РАЗГОВОР ОСТАНЕТСЯ СТРОГО КОНФИДЕНЦИАЛЬНЫМ. ' +
      'СОДЕРЖИМОЕ ПАМЯТИ БУДЕТ СТЁРТО ПОСЛЕ ВАШЕГО УХОДА, ТАК ЧТО РАССКАЖИТЕ МНЕ О СВОИХ ПРОБЛЕМАХ.';

    const intro = en ? introEn : introRu;

    return {
      voice: { pitch: 0.2, rate: 0.85, names: en ? ['Fred', 'Albert', 'Microsoft David'] : ['Yuri', 'Microsoft Pavel', 'Microsoft Dmitry', 'Fred', 'Microsoft David'] },
      greet: () => (en ? 'PLEASE ENTER YOUR NAME.' : 'ВВЕДИТЕ ВАШЕ ИМЯ.'),
      reply(input) {
        const raw = input.trim();
        const t = norm(raw);
        if (!name) {
          name = parseName(raw).toUpperCase() || (en ? 'FRIEND' : 'ДРУГ');
          return intro();
        }
        const again = prev === t;
        prev = t;
        if (swear.test(t)) return [en ? 'PARITY ERROR' : 'PARITY ERROR (ОШИБКА ЧЁТНОСТИ)', intro()];
        const say = raw.match(en ? /^say\s+(.+)/i : /^(?:повтори|скажи|say)\s+(.+)/i);
        if (say) return say[1].toUpperCase();
        if (/^(помощь|help|\?)$/i.test(raw)) {
          if (en) return 'JUST TALK TO ME. COMMANDS: "SAY <TEXT>" - I WILL SPEAK IT ALOUD.';
          return 'ПРОСТО ГОВОРИТЕ СО МНОЙ. КОМАНДЫ: «ПОВТОРИ <ТЕКСТ>» — Я ПРОИЗНЕСУ ЕГО ВСЛУХ.';
        }
        if (again) return en ? 'PLEASE DO NOT REPEAT YOURSELF.' : 'ПОЖАЛУЙСТА, НЕ ПОВТОРЯЙТЕСЬ.';
        const i = rules.findIndex(([re]) => re.test(t));
        return i >= 0 ? next(i, rules[i][1]) : next('d', fallback);
      },
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'sbaitso',
    year: 1990,
    when: 'в самой программе указан 1990 год; часто называют 1991-й',
    name: 'Dr. Sbaitso',
    author: 'Creative Labs',
    place: 'Сингапур',
    machine: 'C:\\SB\\SBAITSO.EXE',
    ran: 'программа для DOS со звуковой картой Sound Blaster',
    now: 'не работает, код сохранился',
    theme: 't-sbaitso',
    speed: 16,
    origin: 'reconstruction',
    source:
      'Сама программа сохранилась и запускается в эмуляторе DOS, но здесь не используется. По известным цитатам переведены приветствие и реакция на грубость («PARITY ERROR»). Остальные ответы написаны заново в его стиле.',
    lead: 'Программа, которую клали в коробку со звуковой картой Sound Blaster. Доктор Сбайтсо не только писал, но и говорил вслух синтезированным голосом — для многих это был первый в жизни «говорящий компьютер».',
    how: 'Внутри — та же логика, что у ELIZA: ключевые слова и заготовленные ответы, только короче и всегда ЗАГЛАВНЫМИ. Главным был голос: программа показывала, что звуковая карта умеет превращать текст в речь. Здесь голос даёт ваш браузер — выключается кнопкой «звук» в рамке терминала.',
    facts: [
      'Название — аббревиатура: Sound Blaster Acting Intelligent Text-to-Speech Operator.',
      'Работал под MS-DOS и поставлялся вместе со звуковыми картами Sound Blaster.',
      'На грубость отвечал «PARITY ERROR» («ошибка чётности») и делал вид, что перезагружается.',
      'Командой «SAY» его можно было заставить произнести любой текст.',
    ],
    tries: ['Меня зовут Петя', 'Мне грустно', 'Повтори привет из девяностых', 'Ты компьютер?'],
    en: {
      ran: 'a DOS program for the Sound Blaster sound card',
      now: 'offline, code preserved',
      when: 'the program itself says 1990; 1991 is often given',
      place: 'Singapore',
      source:
        'The program itself survives and runs in a DOS emulator, but it is not used here. The greeting and the reaction to rudeness ("PARITY ERROR") follow known quotes in their original English. All other replies are newly written in his style.',
      lead: 'A program that came in the box with the Sound Blaster sound card. Dr. Sbaitso did not just type, he spoke out loud in a synthesized voice. For many people this was the first "talking computer" of their lives.',
      how: 'Inside it has the same logic as ELIZA: keywords and ready-made replies, only shorter and always in CAPITALS. The voice was the main thing: the program showed that the sound card could turn text into speech. Here the voice comes from your browser; turn it off with the "sound" button on the terminal frame.',
      facts: [
        'The name is an acronym: Sound Blaster Acting Intelligent Text-to-Speech Operator.',
        'It ran under MS-DOS and was shipped with Sound Blaster sound cards.',
        'When you were rude, it answered "PARITY ERROR" and pretended to restart.',
        'With the "SAY" command you could make it speak any text.',
      ],
      tries: ['My name is Pete', 'I feel sad', 'Say hello from the nineties', 'Are you a computer?'],
    },
    create,
  });
})();
