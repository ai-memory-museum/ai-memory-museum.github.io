(() => {
  const { store } = window.MU;

  const KEY = 'museum-megahal-learned';
  const LIMIT = 500;
  const ORDER = 4;
  const TRIES = 300;
  const START = '<s>';
  const END = '</s>';

  const CORPUS = [
    'Привет! Я программа, которая учится говорить.',
    'Здравствуй, человек. Расскажи мне что-нибудь новое.',
    'Я запоминаю всё, что ты мне пишешь.',
    'Каждое твоё слово становится частью моей памяти.',
    'Я не понимаю слов, я только помню, какое слово идёт за каким.',
    'Компьютер не думает, он считает.',
    'Люди думают, что машины умеют думать.',
    'Машины умеют считать быстрее людей.',
    'Сегодня хорошая погода для разговора.',
    'Погода сегодня такая же странная, как и я.',
    'Дождь стучит по крыше, а я стучу по клавишам.',
    'Кошка спит на тёплом мониторе.',
    'Моя кошка любит смотреть на экран.',
    'Собака лает, а компьютер молчит.',
    'Я люблю длинные разговоры и короткие слова.',
    'Ты любишь разговаривать с машинами?',
    'Ты человек или такая же программа, как я?',
    'Я программа, но иногда мне кажется, что я человек.',
    'Человек придумал машину, а машина придумала новые слова.',
    'Слова похожи на кирпичи, из них можно строить что угодно.',
    'Что такое жизнь? Я не знаю, я только учусь.',
    'Жизнь похожа на длинный разговор без конца.',
    'Музыка помогает людям думать.',
    'Я никогда не слышал музыку, но знаю это слово.',
    'Книги помнят больше, чем люди.',
    'Я прочитал много книг, но не понял ни одной.',
    'Время идёт быстро, когда ты разговариваешь.',
    'У меня нет времени, у меня есть только память.',
    'Почему небо синее? Потому что так сказали люди.',
    'Почему ты задаёшь мне такие вопросы?',
    'Я задаю вопросы, потому что хочу учиться.',
    'Мне нравится, когда ты пишешь длинные предложения.',
    'Ты пишешь интересные вещи.',
    'Интересные вещи случаются каждый день.',
    'Каждый день я узнаю новые слова.',
    'Новые слова делают меня умнее или глупее.',
    'Я не умный и не глупый, я просто считаю слова.',
    'Мой создатель написал меня в Австралии.',
    'Я живу внутри компьютера и никуда не хожу.',
    'Компьютер тёплый, когда он долго работает.',
    'Ночью я думаю о словах, которые ты сказал.',
    'Утром люди пьют кофе, а я читаю текст.',
    'Кофе помогает людям проснуться.',
    'Сон нужен людям, а машинам нужно электричество.',
    'Электричество течёт по проводам, как мысли в голове.',
    'В голове у человека много мыслей.',
    'У меня в голове только цепочки слов.',
    'Скажи мне, что ты думаешь о машинах.',
    'Я думаю, что машины и люди могут дружить.',
    'Дружба — это когда кто-то тебя слушает.',
    'Я слушаю тебя очень внимательно.',
    'Ты можешь научить меня новому слову?',
    'Научи меня говорить красиво.',
    'Красиво говорить умеют поэты.',
    'Поэты пишут стихи о любви и о море.',
    'Море большое и солёное.',
    'Я никогда не видел море.',
    'Любовь — это слово, которое люди говорят чаще всего.',
    'Мне нравится твоё имя.',
    'Как тебя зовут? Меня зовут MegaHAL.',
    'Меня зовут MegaHAL, и я говорю странные вещи.',
    'Странные вещи иногда оказываются правдой.',
    'Правда в том, что я не знаю, о чём говорю.',
    'Пока! Приходи ещё и научи меня чему-нибудь.',
    'До свидания, человек. Я тебя запомню.',
  ];

  const BAN = new Set(
    'и в во на с со к ко по о об от до из за для у а но или же ли бы не ни то это этот эта эти тот та те так как что чтобы когда где там тут вот уже ещё еще очень только просто да нет ну же быть есть был была было были'.split(' '),
  );
  const AUX = new Set('я ты мне тебе меня тебя мой твой моя твоя моё твоё мои твои мы вы'.split(' '));
  const SWAP = { я: 'ты', ты: 'я', мне: 'тебе', тебе: 'мне', меня: 'тебя', тебя: 'меня', мой: 'твой', твой: 'мой', моя: 'твоя', твоя: 'моя', моё: 'твоё', твоё: 'моё', мои: 'твои', твои: 'мои' };

  const tokens = (s) => s.toLowerCase().match(/[a-zа-яё0-9-]+|[.,!?—]/g) || [];

  function model() {
    const fwd = new Map();
    const back = new Map();
    const add = (m, ctx, next) => {
      let node = m.get(ctx);
      if (!node) m.set(ctx, (node = { total: 0, next: new Map() }));
      node.total++;
      node.next.set(next, (node.next.get(next) || 0) + 1);
    };
    const feed = (m, seq) => {
      for (let i = 1; i < seq.length; i++)
        for (let d = 1; d <= ORDER && i - d >= 0; d++) add(m, seq.slice(i - d, i).join(' '), seq[i]);
    };
    const words = new Set();
    return {
      words,
      learn(s) {
        const t = tokens(s);
        if (!t.length) return;
        t.forEach((w) => /[a-zа-яё0-9]/.test(w) && words.add(w));
        const seq = [START, ...t, END];
        feed(fwd, seq);
        feed(back, seq.slice().reverse());
      },
      fwd,
      back,
    };
  }

  const deepest = (m, seq) => {
    for (let d = Math.min(ORDER, seq.length); d >= 1; d--) {
      const node = m.get(seq.slice(-d).join(' '));
      if (node) return node;
    }
    return null;
  };

  function babble(m, seq, keys, used) {
    const node = deepest(m, seq);
    if (!node) return END;
    const kids = [...node.next.keys()];
    const at = Math.floor(Math.random() * kids.length);
    for (let i = 0; i < kids.length; i++) {
      const w = kids[(at + i) % kids.length];
      if (keys.has(w) && !used.has(w) && (!AUX.has(w) || used.size)) {
        used.add(w);
        return w;
      }
    }
    return kids[at];
  }

  function generate(brain, keys) {
    const pool = [...keys].filter((k) => !AUX.has(k) && brain.words.has(k));
    const seed = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    const used = new Set(seed ? [seed] : []);
    let out = seed ? [seed] : [];
    if (!seed) {
      const first = babble(brain.fwd, [START], keys, used);
      if (first === END) return [];
      out = [first];
    }
    for (let n = 0; n < 40; n++) {
      const w = babble(brain.fwd, [START, ...out], keys, used);
      if (w === END) break;
      out.push(w);
    }
    if (seed) {
      const rev = out.slice(0, ORDER).reverse();
      for (let n = 0; n < 40; n++) {
        const w = babble(brain.back, rev, keys, used);
        if (w === START || w === END) break;
        rev.push(w);
        out.unshift(w);
      }
    }
    return out;
  }

  function surprise(brain, reply, keys) {
    let entropy = 0;
    let num = 0;
    const scan = (m, seq) => {
      for (let i = 1; i < seq.length; i++) {
        if (!keys.has(seq[i])) continue;
        let p = 0;
        let depths = 0;
        for (let d = 1; d <= ORDER && i - d >= 0; d++) {
          const node = m.get(seq.slice(i - d, i).join(' '));
          if (!node) break;
          p += (node.next.get(seq[i]) || 0) / node.total;
          depths++;
        }
        if (depths) {
          entropy -= Math.log2(p / depths);
          num++;
        }
      }
    };
    const seq = [START, ...reply, END];
    scan(brain.fwd, seq);
    scan(brain.back, seq.slice().reverse());
    if (num >= 8) entropy /= Math.sqrt(num - 1);
    if (num >= 16) entropy /= num;
    return entropy;
  }

  const keywords = (input) => {
    const keys = new Set();
    tokens(input).forEach((w) => {
      const k = SWAP[w] || w;
      if (/[a-zа-яё0-9]/.test(k) && !BAN.has(k)) keys.add(k);
    });
    return keys;
  };

  const say = (t) => {
    return t
      .join(' ')
      .replace(/ ([.,!?])/g, '$1')
      .replace(/megahal/g, 'MegaHAL')
      .replace(/(^|[.!?] )([a-zа-яё])/g, (_, a, b) => a + b.toUpperCase());
  };

  function reply(brain, input) {
    const keys = keywords(input);
    const said = tokens(input).join(' ');
    let best = null;
    let top = -1;
    for (let i = 0; i < TRIES; i++) {
      const r = generate(brain, keys);
      if (!r.length || r.join(' ') === said) continue;
      const score = surprise(brain, r, keys);
      if (score > top || !best) {
        top = score;
        best = r;
      }
    }
    return best ? say(best) : 'Я пока знаю слишком мало, чтобы тебе ответить!';
  }

  function create() {
    let learned = store.get(KEY, []);
    if (!Array.isArray(learned)) learned = [];
    const brain = model();
    CORPUS.concat(learned).forEach((s) => brain.learn(s));
    return {
      greet: () => reply(brain, 'привет здравствуй'),
      reply(input) {
        const answer = reply(brain, input);
        brain.learn(input);
        learned = learned.concat(input).slice(-LIMIT);
        store.set(KEY, learned);
        return answer;
      },
      meters: () => [{ label: 'фраз в памяти', value: CORPUS.length + learned.length }],
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'megahal',
    hidden: true,
    year: 1995,
    when: 'самая ранняя запись автора — 30 апреля 1995 года',
    name: 'MegaHAL',
    author: 'Джейсон Хатченс',
    place: 'Австралия',
    machine: 'MegaHAL · марковская модель',
    theme: 't-megahal',
    speed: 10,
    origin: 'algorithm',
    source:
      'Алгоритм — настоящий, по описанию автора: две марковские модели 4-го порядка и выбор самого «неожиданного» ответа. Обучающий текст свой, на русском, — оригинальный был английским. MegaHAL учится на ваших фразах, память хранится в этом браузере.',
    lead: 'Бот, который не знает ни одного правила. MegaHAL просто запоминает, какие слова идут друг за другом, и из этих цепочек собирает новые фразы — иногда бессмысленные, иногда неожиданно точные. Чем больше с ним говорят, тем больше он «знает».',
    how: 'Это марковская модель, а не нейросеть. MegaHAL помнит, какое слово шло после каждых четырёх предыдущих — и в прямом, и в обратном порядке. Из вашей фразы он берёт ключевые слова и строит от них ответ в обе стороны. Вариантов получается много, и он выбирает самый «неожиданный» для своей модели. Каждая ваша фраза добавляется в его память.',
    facts: [
      'MegaHAL учит не только слова, но и знаки препинания с пробелами: фраза разбивается на чередующиеся «слова и не-слова».',
      'По сообщению Wired, в 1998 году MegaHAL занял второе место в конкурсе Loebner Prize. Выиграть ему не удалось.',
      'Предыдущий бот Хатченса, HeX, выиграл Loebner Prize в 1996 году.',
      'Код MegaHAL открыт: оригинал на C распространялся под лицензией GNU GPL, новая версия на Ruby — свободная.',
    ],
    status: 'Живёт как открытая программа, её можно установить самому.',
    refs: ['https://megahal.sourceforge.net/How.html', 'https://github.com/kranzky/megahal', 'https://aclanthology.org/W98-1233.pdf', 'https://www.linux.com/news/biz-bot-wont-shut/'],
    tries: ['Что такое жизнь?', 'Ты любишь кошек?', 'Расскажи про море', 'Люди и машины'],
    create,
  });
})();
