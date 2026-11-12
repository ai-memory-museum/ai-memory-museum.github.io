(() => {
  const IRREG_1_TO_2 = {
    могу: 'можете', хочу: 'хотите', буду: 'будете', знаю: 'знаете', люблю: 'любите', боюсь: 'боитесь',
    иду: 'идете', сплю: 'спите', ем: 'едите', живу: 'живете', вижу: 'видите', ненавижу: 'ненавидите',
    говорю: 'говорите', сижу: 'сидите', хожу: 'ходите', прошу: 'просите', плачу: 'плачете', пишу: 'пишете',
    верю: 'верите', помню: 'помните', злюсь: 'злитесь', учусь: 'учитесь', тоскую: 'тоскуете',
    сдам: 'сдадите', дам: 'дадите', пойду: 'пойдете', уйду: 'уйдете', найду: 'найдете', смогу: 'сможете', скажу: 'скажете', получу: 'получите', куплю: 'купите', умру: 'умрете',
    курю: 'курите', звоню: 'звоните', смотрю: 'смотрите', слышу: 'слышите', держу: 'держите',
  };
  const IRREG_2_TO_1 = {
    можешь: 'могу', можете: 'могу', хочешь: 'хочу', хотите: 'хочу', будешь: 'буду', будете: 'буду',
    любишь: 'люблю', любите: 'люблю', ненавидишь: 'ненавижу', ненавидите: 'ненавижу', видишь: 'вижу', видите: 'вижу',
    говоришь: 'говорю', говорите: 'говорю', веришь: 'верю', верите: 'верю', помнишь: 'помню', помните: 'помню',
    злишься: 'злюсь', злитесь: 'злюсь', спишь: 'сплю', спите: 'сплю', живешь: 'живу', живете: 'живу',
    слышишь: 'слышу', слышите: 'слышу', смотришь: 'смотрю', смотрите: 'смотрю', идешь: 'иду', идете: 'иду',
    боишься: 'боюсь', боитесь: 'боюсь', пишешь: 'пишу', пишете: 'пишу',
  };

  const to2 = (w) => {
    if (IRREG_1_TO_2[w]) return IRREG_1_TO_2[w];
    if (/[аяеу]ю$/.test(w)) return w.slice(0, -1) + 'ете';
    if (/[аяе]юсь$/.test(w)) return w.slice(0, -3) + 'етесь';
    if (/л[аи]?$/.test(w)) return w.replace(/л[аи]?$/, 'ли');
    if (/л(ся|ась|ись)$/.test(w)) return w.replace(/л(ся|ась|ись)$/, 'лись');
    return w;
  };
  const to1 = (w) => {
    if (IRREG_2_TO_1[w]) return IRREG_2_TO_1[w];
    if (/[аяеу]е(шь|те)$/.test(w)) return w.replace(/е(шь|те)$/, 'ю');
    if (/[аяеу]е(шься|тесь)$/.test(w)) return w.replace(/е(шься|тесь)$/, 'юсь');
    return w;
  };

  const YA = ['я'];
  const YOU = ['ты', 'вы'];
  const SUBST = {
    я: 'вы', меня: 'вас', мне: 'вам', мной: 'вами',
    мой: 'ваш', моя: 'ваша', мое: 'ваше', мои: 'ваши', моего: 'вашего', моей: 'вашей', мою: 'вашу', моим: 'вашим', моих: 'ваших', моему: 'вашему',
    ты: 'я', вы: 'я', тебя: 'меня', вас: 'меня', тебе: 'мне', вам: 'мне', тобой: 'мной', вами: 'мной',
    твой: 'мой', твоя: 'моя', твое: 'мое', твои: 'мои', твоего: 'моего', твоей: 'моей', твою: 'мою', твоим: 'моим', твоих: 'моих',
    ваш: 'мой', ваша: 'моя', ваше: 'мое', ваши: 'мои', вашего: 'моего', вашей: 'моей', вашу: 'мою', вашим: 'моим', ваших: 'моих',
  };

  const CLASSES = {
    ВАШ: ['ваш', 'ваша', 'ваше', 'ваши', 'вашего', 'вашей', 'вашу', 'вашим', 'ваших', 'вашему'],
    МОЙ: ['мой', 'моя', 'мое', 'мои', 'моего', 'моей', 'мою', 'моим', 'моих', 'моему'],
    МЕНЯ: ['меня', 'мне', 'мной', 'я'],
    FAMILY: [
      'мама', 'мамы', 'маме', 'маму', 'мамой', 'мать', 'матери', 'матерью', 'папа', 'папы', 'папе', 'папу', 'папой',
      'отец', 'отца', 'отцу', 'отцом', 'сестра', 'сестры', 'сестре', 'сестру', 'сестрой', 'брат', 'брата', 'брату', 'братом',
      'жена', 'жены', 'жене', 'жену', 'женой', 'муж', 'мужа', 'мужу', 'мужем', 'дети', 'детей', 'детям', 'детьми',
    ],
  };
  const ADJ_WORDS = ['рад', 'рада', 'болен', 'больна', 'должен', 'должна', 'готов', 'готова', 'уверен', 'уверена', 'зол', 'зла', 'одинок', 'одинока', 'виноват', 'виновата', 'счастлив', 'счастлива', 'несчастен', 'несчастна'];
  const isAdj = (w) => ADJ_WORDS.includes(w) || (w.length >= 4 && /(ый|ий|ой|ая|яя|ое|ее|ые|ие|ен|на|ны|ым|им)$/.test(w));

  const tokenMatch = (tok, w) => {
    if (tok.startsWith('/')) {
      const tag = tok.slice(1);
      return tag === 'ПРИЛ' ? isAdj(w) : CLASSES[tag].includes(w);
    }
    return tok.split('|').includes(w);
  };

  const match = (pat, words, tm = tokenMatch) => {
    const out = [];
    const go = (pi, wi) => {
      if (pi === pat.length) return wi === words.length;
      const tok = pat[pi];
      if (tok === '0') {
        for (let k = wi; k <= words.length; k++) {
          out[pi] = words.slice(wi, k);
          if (go(pi + 1, k)) return true;
        }
        return false;
      }
      if (/^\d+$/.test(tok)) {
        const n = +tok;
        if (wi + n > words.length) return false;
        out[pi] = words.slice(wi, wi + n);
        return go(pi + 1, wi + n);
      }
      if (wi < words.length && tm(tok, words[wi])) {
        out[pi] = [words[wi]];
        return go(pi + 1, wi + 1);
      }
      return false;
    };
    return go(0, 0) ? out : null;
  };

  const assemble = (tpl, parts) =>
    tpl
      .replace(/\b(\d)\b/g, (_, n) => (parts[n - 1] || []).join(' '))
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.?!])/g, '$1')
      .trim()
      .toUpperCase();

  const R = (p, ...re) => ({ pat: p.split(' '), re });

  const SCRIPT = {
    greet: 'КАК ПОЖИВАЕТЕ. Я ДОКТОР. ПОЖАЛУЙСТА, САДИТЕСЬ ЗА ПИШУЩУЮ МАШИНКУ И РАССКАЖИТЕ МНЕ О СВОЕЙ ПРОБЛЕМЕ.',
    memory: {
      words: CLASSES.МОЙ,
      rules: [
        R('0 /ВАШ 0', 'ДАВАЙТЕ ПОДРОБНЕЕ ОБСУДИМ, ПОЧЕМУ 2 3'),
        R('0 /ВАШ 0', 'РАНЕЕ ВЫ СКАЗАЛИ, ЧТО 2 3'),
        R('0 /ВАШ 0', 'НО 2 3'),
        R('0 /ВАШ 0', 'СВЯЗАНО ЛИ ЭТО С ТЕМ, ЧТО 2 3'),
      ],
    },
    none: ['Я НЕ УВЕРЕН, ЧТО ПОНИМАЮ ВАС ПОЛНОСТЬЮ', 'ПОЖАЛУЙСТА, ПРОДОЛЖАЙТЕ', 'О ЧЁМ ЭТО ВАМ ГОВОРИТ', 'ВАМ ОЧЕНЬ ВАЖНО ОБСУЖДАТЬ ТАКИЕ ВЕЩИ'],
    keywords: [
      { words: ['если'], prec: 3, rules: [R('0 если 0', 'ВЫ ДУМАЕТЕ, ЭТО ВЕРОЯТНО, ЧТО 3', 'ВЫ ХОТИТЕ, ЧТОБЫ 3', 'ЧТО ВЫ ДУМАЕТЕ О ТОМ, ЧТО 3', 'В САМОМ ДЕЛЕ, 2 3')] },
      { words: ['как'], link: 'что' },
      { words: ['когда'], link: 'что' },
      { words: ['возможно', 'пожалуй', 'вероятно'], id: 'возможно', rules: [R('0', 'ВЫ, КАЖЕТСЯ, НЕ СОВСЕМ УВЕРЕНЫ', 'ПОЧЕМУ ТАКОЙ НЕУВЕРЕННЫЙ ТОН', 'РАЗВЕ ВЫ НЕ МОЖЕТЕ СКАЗАТЬ УВЕРЕННЕЕ', 'ВЫ НЕ УВЕРЕНЫ', 'РАЗВЕ ВЫ НЕ ЗНАЕТЕ')] },
      { words: ['наверное', 'наверно'], link: 'возможно' },
      {
        words: ['являюсь'],
        rules: [
          R('0 являетесь ли вы 0', 'ВЫ ВЕРИТЕ, ЧТО ВЫ 5', 'ВЫ ХОТЕЛИ БЫ БЫТЬ 5', 'ВЫ ХОТИТЕ, ЧТОБЫ Я СКАЗАЛ ВАМ, ЧТО ВЫ 5', 'ЧТО БЫ ЭТО ЗНАЧИЛО, ЕСЛИ БЫ ВЫ БЫЛИ 5'),
          R('0', 'ПОЧЕМУ ВЫ ГОВОРИТЕ «ЯВЛЯЮСЬ»', 'Я ЭТОГО НЕ ПОНИМАЮ'),
        ],
      },
      {
        words: ['являешься', 'являетесь'],
        rules: [
          R('0 я являюсь 0', 'ПОЧЕМУ ВАС ИНТЕРЕСУЕТ, ЯВЛЯЮСЬ ЛИ Я 4', 'ВЫ ПРЕДПОЧЛИ БЫ, ЧТОБЫ Я НЕ БЫЛ 4', 'ВОЗМОЖНО, Я ЯВЛЯЮСЬ 4 В ВАШИХ ФАНТАЗИЯХ', 'ВЫ ИНОГДА ДУМАЕТЕ, ЧТО Я 4'),
          R('0 являетесь 0', 'ВЫ ДУМАЛИ, ЧТО ОНИ МОГУТ НЕ БЫТЬ 3', 'ВАМ ПОНРАВИЛОСЬ БЫ, ЕСЛИ БЫ ОНИ НЕ БЫЛИ 3', 'А ЧТО, ЕСЛИ БЫ ОНИ НЕ БЫЛИ 3', 'ВОЗМОЖНО, ОНИ 3'),
        ],
      },
      {
        words: ['твой', 'твоя', 'твое', 'твои', 'твоего', 'твоей', 'твою', 'твоим', 'твоих', 'ваш', 'ваша', 'ваше', 'ваши', 'вашего', 'вашей', 'вашу', 'вашим', 'ваших'],
        rules: [R('0 /МОЙ 0', 'ПОЧЕМУ ВАС ВОЛНУЕТ 2 3', 'А КАК НАСЧЁТ ВАШЕГО СОБСТВЕННОГО: 3', 'ВАС БЕСПОКОИТ ЧЬЁ-ТО ЕЩЁ: 3', 'В САМОМ ДЕЛЕ, 2 3')],
      },
      {
        words: YA,
        rules: [
          R('0 вы /ПРИЛ 0 /МЕНЯ 0', 'ВОЗМОЖНО, ВЫ ТАК ОТНОСИТЕСЬ К КОМУ-ТО ДРУГОМУ', 'ВЫ ТАК ОТНОСИТЕСЬ К КОМУ-НИБУДЬ', 'ВЫ ТАК ОТНОСИТЕСЬ К КОМУ-НИБУДЬ ИЗ ВАШЕЙ СЕМЬИ', 'ВОЗМОЖНО, ВАМ ХОТЕЛОСЬ БЫ, ЧТОБЫ Я БЫЛ 3 4 ВАМ'),
          R('0 вы /ПРИЛ 0', 'ВЫ ПРИШЛИ КО МНЕ ПОТОМУ, ЧТО ВЫ 3 4', 'КАК ДАВНО ВЫ 3 4', 'ВЫ СЧИТАЕТЕ НОРМАЛЬНЫМ, ЧТО ВЫ 3 4', 'ВАМ НРАВИТСЯ, ЧТО ВЫ 3 4'),
          R('0 вы не можете 0', 'ОТКУДА ВЫ ЗНАЕТЕ, ЧТО НЕ МОЖЕТЕ 5', 'ВЫ ПРОБОВАЛИ', 'ВОЗМОЖНО, ТЕПЕРЬ ВЫ СМОЖЕТЕ 5', 'ВЫ ДЕЙСТВИТЕЛЬНО ХОТИТЕ УМЕТЬ 5'),
          R('0 вы не 0', 'РАЗВЕ ВЫ НА САМОМ ДЕЛЕ НЕ 4', 'ПОЧЕМУ ВЫ НЕ 4', 'ВЫ ХОТЕЛИ БЫ, ЧТОБЫ ВЫ МОГЛИ ЭТО', 'ВАС ЭТО БЕСПОКОИТ'),
          R('0 вы чувствуете 0', 'РАССКАЖИТЕ ПОДРОБНЕЕ О ТАКИХ ЧУВСТВАХ', 'ВЫ ЧАСТО ЧУВСТВУЕТЕ 4', 'ВАМ НРАВИТСЯ ЧУВСТВОВАТЬ 4', 'О ЧЁМ ВАМ НАПОМИНАЕТ ЭТО ЧУВСТВО'),
          R('0 вы /МЕНЯ 0', 'ВОЗМОЖНО, В ВАШИХ ФАНТАЗИЯХ ВЫ 4 МЕНЯ, А Я ВАС', 'ВЫ ХОТИТЕ, ЧТОБЫ ТАК И БЫЛО: ВЫ 4 МЕНЯ', 'ПОХОЖЕ, ВАМ НУЖНО, ЧТОБЫ ВЫ 4 МЕНЯ', 'А КОГО-НИБУДЬ ЕЩЁ ВЫ 4'),
          R('0 вы 0 /МЕНЯ 0', 'ВОЗМОЖНО, В ВАШИХ ФАНТАЗИЯХ ВЫ 3 МЕНЯ, А Я ВАС', 'ВЫ ХОТИТЕ, ЧТОБЫ ТАК И БЫЛО: ВЫ 3 МЕНЯ', 'ПОХОЖЕ, ВАМ НУЖНО, ЧТОБЫ ВЫ 3 МЕНЯ', 'А КОГО-НИБУДЬ ЕЩЁ ВЫ 3'),
          R('0', 'ВЫ ГОВОРИТЕ: 1', 'МОЖЕТЕ РАССКАЗАТЬ ОБ ЭТОМ ПОДРОБНЕЕ', 'ВЫ ГОВОРИТЕ «1» ПО КАКОЙ-ТО ОСОБОЙ ПРИЧИНЕ', 'ЭТО ВЕСЬМА ИНТЕРЕСНО'),
        ],
      },
      {
        words: YOU,
        rules: [
          R('0 я вас 0', 'ПОЧЕМУ ВЫ ДУМАЕТЕ, ЧТО Я 4 ВАС', 'А ВАШИ РОДИТЕЛИ ТОЖЕ ТАК С ВАМИ'),
          R('0 я 0 вас 0', 'ПОЧЕМУ ВЫ ДУМАЕТЕ, ЧТО Я 3 ВАС', 'А ВАШИ РОДИТЕЛИ ТОЖЕ ТАК С ВАМИ'),
          R('0 я /ПРИЛ 0', 'ПОЧЕМУ ВЫ ДУМАЕТЕ, ЧТО Я 3 4', 'ВАМ ПРИЯТНО ДУМАТЬ, ЧТО Я 3 4', 'ВАМ ИНОГДА ХОЧЕТСЯ, ЧТОБЫ ВЫ САМИ БЫЛИ 3 4', 'ВОЗМОЖНО, ВЫ ХОТЕЛИ БЫ САМИ БЫТЬ 3 4'),
          R('0 я 0', 'МЫ ГОВОРИЛИ О ВАС, А НЕ ОБО МНЕ', 'О, Я 3', 'ВЫ ВЕДЬ ГОВОРИТЕ НЕ ОБО МНЕ, ПРАВДА', 'ЧТО ВЫ СЕЙЧАС ЧУВСТВУЕТЕ'),
        ],
      },
      { words: ['да', 'ага', 'угу', 'конечно'], rules: [R('0', 'ВЫ, КАЖЕТСЯ, ВПОЛНЕ УВЕРЕНЫ', 'ВЫ УВЕРЕНЫ', 'ПОНЯТНО', 'ПОНИМАЮ')] },
      { words: ['нет'], rules: [R('0', 'ВЫ ГОВОРИТЕ «НЕТ» ПРОСТО ИЗ ЧУВСТВА ПРОТЕСТА', 'ВЫ НАСТРОЕНЫ НЕМНОГО НЕГАТИВНО', 'ПОЧЕМУ НЕТ', 'ПОЧЕМУ «НЕТ»')] },
      {
        words: CLASSES.МОЙ,
        memory: true,
        rules: [
          R('0 /ВАШ 0 /FAMILY 0', 'РАССКАЖИТЕ ПОДРОБНЕЕ О ВАШЕЙ СЕМЬЕ', 'КТО ЕЩЁ В ВАШЕЙ СЕМЬЕ 5', '2 4', 'ЧТО ЕЩЁ ПРИХОДИТ ВАМ НА УМ, КОГДА ВЫ ДУМАЕТЕ: 2 4'),
          R('0 /ВАШ 0', '2 3', 'ПОЧЕМУ ВЫ ГОВОРИТЕ: 2 3', 'ЭТО НАВОДИТ ВАС НА МЫСЛЬ О ЧЁМ-ТО ЕЩЁ, ЧТО ПРИНАДЛЕЖИТ ВАМ', 'ДЛЯ ВАС ВАЖНО, ЧТО 2 3'),
        ],
      },
      {
        words: ['могу', 'можешь', 'можете', 'может'],
        rules: [
          R('0 я могу 0', 'ВЫ ВЕРИТЕ, ЧТО Я МОГУ 4, ПРАВДА', 'ВЫ ХОТИТЕ, ЧТОБЫ Я МОГ 4', 'ВОЗМОЖНО, ВЫ САМИ ХОТЕЛИ БЫ УМЕТЬ 4'),
          R('0 вы можете 0', 'СМОЖЕТЕ ЛИ ВЫ 4, ЗАВИСИТ БОЛЬШЕ ОТ ВАС, ЧЕМ ОТ МЕНЯ', 'ВЫ ХОТИТЕ УМЕТЬ 4', 'ВОЗМОЖНО, ВЫ НЕ ХОТИТЕ 4'),
        ],
      },
      {
        words: ['что', 'чем', 'какой', 'какая', 'какое', 'какие'],
        id: 'что',
        rules: [
          R('0', 'ПОЧЕМУ ВЫ СПРАШИВАЕТЕ', 'ВАС ИНТЕРЕСУЕТ ЭТОТ ВОПРОС', 'ЧТО ВЫ НА САМОМ ДЕЛЕ ХОТИТЕ ЗНАТЬ', 'ТАКИЕ ВОПРОСЫ ЧАСТО ПРИХОДЯТ ВАМ В ГОЛОВУ', 'КАКОЙ ОТВЕТ ПОНРАВИЛСЯ БЫ ВАМ БОЛЬШЕ ВСЕГО', 'А ЧТО ДУМАЕТЕ ВЫ', 'ЧТО ПРИХОДИТ ВАМ НА УМ, КОГДА ВЫ ЭТО СПРАШИВАЕТЕ', 'ВЫ ЗАДАВАЛИ ТАКИЕ ВОПРОСЫ РАНЬШЕ', 'ВЫ СПРАШИВАЛИ КОГО-НИБУДЬ ЕЩЁ'),
        ],
      },
      { words: ['потому', 'поскольку'], rules: [R('0', 'ЭТО НАСТОЯЩАЯ ПРИЧИНА', 'РАЗВЕ НЕ ПРИХОДЯТ НА УМ ДРУГИЕ ПРИЧИНЫ', 'ЭТА ПРИЧИНА ОБЪЯСНЯЕТ ЧТО-НИБУДЬ ЕЩЁ', 'КАКИЕ ЕЩЁ МОГУТ БЫТЬ ПРИЧИНЫ')] },
      {
        words: ['почему', 'зачем'],
        link: 'что',
        rules: [
          R('0 почему я не 0', 'ВЫ ДУМАЕТЕ, ЧТО Я НЕ 5', 'ВОЗМОЖНО, Я 5 В СВОЁ ВРЕМЯ', 'А МОЖЕТ, ВАМ СТОИТ СДЕЛАТЬ ЭТО САМОМУ', 'ВЫ ХОТИТЕ, ЧТОБЫ Я ЭТО ДЕЛАЛ'),
          R('0 почему вы не можете 0', 'ВЫ ДУМАЕТЕ, ЧТО ДОЛЖНЫ МОЧЬ 6', 'ВЫ ХОТИТЕ УМЕТЬ 6', 'ВЫ ДУМАЕТЕ, ЧТО ЭТО ПОМОЖЕТ ВАМ 6', 'ВЫ ПОНИМАЕТЕ, ПОЧЕМУ НЕ МОЖЕТЕ 6'),
        ],
      },
      {
        words: ['все', 'всех', 'всем', 'каждый'],
        prec: 2,
        id: 'все',
        rules: [
          R('0', 'В САМОМ ДЕЛЕ, ВСЕ', 'МОЖЕТЕ ВСПОМНИТЬ КОГО-ТО КОНКРЕТНОГО', 'КТО, НАПРИМЕР', 'ВЫ ДУМАЕТЕ О ОЧЕНЬ ОСОБЕННОМ ЧЕЛОВЕКЕ', 'КТО ЖЕ, ПОЗВОЛЬТЕ СПРОСИТЬ', 'КТО-ТО ОСОБЕННЫЙ, ВОЗМОЖНО', 'У ВАС ЕСТЬ НА УМЕ КОНКРЕТНЫЙ ЧЕЛОВЕК, ВЕДЬ ТАК', 'О КОМ, ПО-ВАШЕМУ, ВЫ ГОВОРИТЕ'),
        ],
      },
      { words: ['никто', 'никого', 'никому'], prec: 2, link: 'все' },
      { words: ['всегда'], prec: 1, rules: [R('0', 'МОЖЕТЕ ПРИВЕСТИ КОНКРЕТНЫЙ ПРИМЕР', 'КОГДА', 'О КАКОМ СЛУЧАЕ ВЫ ДУМАЕТЕ', 'В САМОМ ДЕЛЕ, ВСЕГДА')] },
    ],
  };

  const byId = new Map();
  SCRIPT.keywords.forEach((k) => {
    k.prec = k.prec || 0;
    byId.set(k.id || k.words[0], k);
  });
  const findKeyword = (w) => SCRIPT.keywords.find((k) => k.words.includes(w));

  const SUBJECTS = ['я', 'ты', 'вы'];

  const transform = (words) => {
    const conv = new Map();
    words.forEach((w, i) => {
      if (!SUBJECTS.includes(w)) return;
      for (let j = i + 1; j < Math.min(words.length, i + 4); j++) {
        const x = words[j];
        if (x === 'не' || (SUBST[x] && !SUBJECTS.includes(x))) continue;
        if (!SUBST[x]) conv.set(j, w === 'я' ? to2 : to1);
        break;
      }
    });
    return words.map((w, i) => SUBST[w] || (conv.has(i) ? conv.get(i)(w) : w));
  };

  const E = (p, ...re) => ({ pat: p.split(' '), re });

  const SCRIPT_EN = {
    greet: 'HOW DO YOU DO. I AM THE DOCTOR. PLEASE SIT DOWN AT THE TYPEWRITER AND TELL ME YOUR PROBLEM.',
    memory: [
      E('0 YOUR 0', 'LETS DISCUSS FURTHER WHY YOUR 3'),
      E('0 YOUR 0', 'EARLIER YOU SAID YOUR 3'),
      E('0 YOUR 0', 'BUT YOUR 3'),
      E('0 YOUR 0', 'DOES THAT HAVE ANYTHING TO DO WITH THE FACT THAT YOUR 3'),
    ],
    none: E('0', 'I AM NOT SURE I UNDERSTAND YOU FULLY', 'PLEASE GO ON', 'WHAT DOES THAT SUGGEST TO YOU', 'DO YOU FEEL STRONGLY ABOUT DISCUSSING SUCH THINGS'),
    subst: { WAS: 'WERE', WERE: 'WAS', ME: 'YOU', "YOU'RE": "I'M", "I'M": "YOU'RE", MYSELF: 'YOURSELF', YOURSELF: 'MYSELF' },
    dlist: { MOTHER: ['NOUN', 'FAMILY'], FATHER: ['NOUN', 'FAMILY'], SISTER: ['FAMILY'], BROTHER: ['FAMILY'], WIFE: ['FAMILY'], CHILDREN: ['FAMILY'] },
    keywords: {
      IF: { rank: 3, rules: [E('0 IF 0', 'DO YOU THINK ITS LIKELY THAT 3', 'DO YOU WISH THAT 3', 'WHAT DO YOU THINK ABOUT 3', 'REALLY, 2 3')] },
      HOW: { link: 'WHAT' },
      WHEN: { link: 'WHAT' },
      PERHAPS: { rules: [E('0', "YOU DON'T SEEM QUITE CERTAIN", 'WHY THE UNCERTAIN TONE', "CAN'T YOU BE MORE POSITIVE", "YOU AREN'T SURE", "DON'T YOU KNOW")] },
      MAYBE: { link: 'PERHAPS' },
      AM: {
        sub: 'ARE',
        rules: [
          E('0 ARE YOU 0', 'DO YOU BELIEVE YOU ARE 4', 'WOULD YOU WANT TO BE 4', 'YOU WISH I WOULD TELL YOU YOU ARE 4', 'WHAT WOULD IT MEAN IF YOU WERE 4'),
          E('0', "WHY DO YOU SAY 'AM'", "I DON'T UNDERSTAND THAT"),
        ],
      },
      ARE: {
        sub: 'AM',
        rules: [
          E('0 AM I 0', 'WHY ARE YOU INTERESTED IN WHETHER I AM 4 OR NOT', "WOULD YOU PREFER IF I WEREN'T 4", 'PERHAPS I AM 4 IN YOUR FANTASIES', 'DO YOU SOMETIMES THINK I AM 4'),
          E('0 AM 0', 'DID YOU THINK THEY MIGHT NOT BE 3', 'WOULD YOU LIKE IT IF THEY WERE NOT 3', 'WHAT IF THEY WERE NOT 3', 'POSSIBLY THEY ARE 3'),
        ],
      },
      YOUR: { sub: 'MY', rules: [E('0 MY 0', 'WHY ARE YOU CONCERNED OVER MY 3', 'WHAT ABOUT YOUR OWN 3', 'ARE YOU WORRIED ABOUT SOMEONE ELSES 3', 'REALLY, MY 3')] },
      I: {
        sub: 'YOU',
        rules: [
          E('0 YOU ARE 0 I 0', 'PERHAPS YOU ARE 4 SOMEONE ELSE', 'ARE YOU 4 ANYONE', 'ARE YOU 4 ANYONE IN YOUR FAMILY', 'PERHAPS YOU WISH I WERE 4 YOU 6'),
          E('0 YOU ARE 0', 'IS IT BECAUSE YOU ARE 4 THAT YOU CAME TO ME', 'HOW LONG HAVE YOU BEEN 4', 'DO YOU BELIEVE IT NORMAL TO BE 4', 'DO YOU ENJOY BEING 4'),
          E("0 YOU CAN'T 0", "HOW DO YOU KNOW YOU CAN'T 4", 'HAVE YOU TRIED', 'PERHAPS YOU COULD 4 NOW', 'DO YOU REALLY WANT TO BE ABLE TO 4'),
          E("0 YOU DON'T 0", "DON'T YOU REALLY 4", "WHY DON'T YOU 4", 'DO YOU WISH TO BE ABLE TO 4', 'DOES THAT TROUBLE YOU'),
          E('0 YOU FEEL 0', 'TELL ME MORE ABOUT SUCH FEELINGS', 'DO YOU OFTEN FEEL 4', 'DO YOU ENJOY FEELING 4', 'OF WHAT DOES FEELING 4 REMIND YOU'),
          E('0 YOU 0 I 0', 'PERHAPS IN YOUR FANTASY WE 3 EACH OTHER', 'DO YOU WISH TO 3 ME', 'YOU SEEM TO NEED TO 3 ME', 'DO YOU 3 ANYONE ELSE'),
          E('0', 'YOU SAY 1', 'CAN YOU ELABORATE ON THAT', 'DO YOU SAY 1 FOR SOME SPECIAL REASON', "THAT'S QUITE INTERESTING"),
        ],
      },
      YOU: {
        sub: 'I',
        rules: [
          E('0 I 0 YOU 0', 'WHY DO YOU THINK I 3 YOU', 'DID YOUR PARENTS 3 YOU'),
          E('0 I AM 0', 'WHAT MAKES YOU THINK I AM 4', 'DOES IT PLEASE YOU TO BELIEVE I AM 4', 'DO YOU SOMETIMES WISH YOU WERE 4', 'PERHAPS YOU WOULD LIKE TO BE 4'),
          E('0 I 0', 'WE WERE DISCUSSING YOU - NOT ME', 'OH, I 3', "YOU'RE NOT REALLY TALKING ABOUT ME - ARE YOU", 'WHAT ARE YOUR FEELINGS NOW'),
        ],
      },
      YES: { rules: [E('0', 'YOU SEEM QUITE POSITIVE', 'YOU ARE SURE', 'I SEE', 'I UNDERSTAND')] },
      NO: { rules: [E('0', "ARE YOU SAYING 'NO' JUST TO BE NEGATIVE", 'YOU ARE BEING A BIT NEGATIVE', 'WHY NOT', "WHY 'NO'")] },
      MY: {
        sub: 'YOUR',
        memory: true,
        rules: [
          E('0 YOUR 0 /FAMILY 0', 'TELL ME MORE ABOUT YOUR FAMILY', 'WHO ELSE IN YOUR FAMILY 5', 'YOUR 4', 'WHAT ELSE COMES TO MIND WHEN YOU THINK OF YOUR 4'),
          E('0 YOUR 0', 'YOUR 3', 'WHY DO YOU SAY YOUR 3', 'DOES THAT SUGGEST ANYTHING ELSE WHICH BELONGS TO YOU', 'IS IT IMPORTANT TO YOU THAT 2 3'),
        ],
      },
      CAN: {
        rules: [
          E('0 CAN I 0', "YOU BELIEVE I CAN 4 DON'T YOU", 'YOU WANT BE TO BE ABLE TO 4', 'PERHAPS YOU WOULD LIKE TO BE ABLE TO 4 YOURSELF'),
          E('0 CAN YOU 0', 'WHETHER OR NOT YOU CAN 4 DEPENDS ON YOU MORE THAN ON ME', 'DO YOU WANT TO BE ABLE TO 4', "PERHAPS YOU DON'T WANT TO 4"),
        ],
      },
      WHAT: {
        rules: [
          E('0', 'WHY DO YOU ASK', 'DOES THAT QUESTION INTEREST YOU', 'WHAT IS IT YOU REALLY WANT TO KNOW', 'ARE SUCH QUESTIONS MUCH ON YOUR MIND', 'WHAT ANSWER WOULD PLEASE YOU MOST', 'WHAT DO YOU THINK', 'WHAT COMES TO YOUR MIND WHEN YOU ASK THAT', 'HAVE YOU ASKED SUCH QUESTIONS BEFORE', 'HAVE YOU ASKED ANYONE ELSE'),
        ],
      },
      BECAUSE: { rules: [E('0', 'IS THAT THE REAL REASON', "DON'T ANY OTHER REASONS COME TO MIND", 'DOES THAT REASON SEEM TO EXPLAIN ANYTHING ELSE', 'WHAT OTHER REASONS MIGHT THERE BE')] },
      WHY: {
        link: 'WHAT',
        rules: [
          E("0 WHY DON'T I 0", "DO YOU BELIEVE I DON'T 5", 'PERHAPS I WILL 5 IN GOOD TIME', 'SHOULD YOU 5 YOURSELF', 'YOU WANT ME TO 5'),
          E("0 WHY CAN'T YOU 0", 'DO YOU THINK YOU SHOULD BE ABLE TO 5', 'DO YOU WANT TO BE ABLE TO 5', 'DO YOU BELIEVE THIS WILL HELP YOU TO 5', "HAVE YOU ANY IDEA WHY YOU CAN'T 5"),
        ],
      },
      EVERYONE: {
        rank: 2,
        rules: [
          E('0', 'REALLY, EVERYONE', 'CAN YOU THINK OF ANYONE IN PARTICULAR', 'WHO, FOR EXAMPLE', 'YOU ARE THINKING OF A VERY SPECIAL PERSON', 'WHO, MAY I ASK', 'SOMEONE SPECIAL PERHAPS', "YOU HAVE A PARTICULAR PERSON IN MIND, DON'T YOU", "WHO DO YOU THINK YOU'RE TALKING ABOUT"),
        ],
      },
      EVERYBODY: { rank: 2, link: 'EVERYONE' },
      NOBODY: { rank: 2, link: 'EVERYONE' },
      NOONE: { rank: 2, link: 'EVERYONE' },
      ALWAYS: { rank: 1, rules: [E('0', 'CAN YOU THINK OF A SPECIFIC EXAMPLE', 'WHEN', 'WHAT INCIDENT ARE YOU THINKING OF', 'REALLY, ALWAYS')] },
    },
  };
  Object.values(SCRIPT_EN.keywords).forEach((k) => (k.rank = k.rank || 0));

  const BARE_EN = { DONT: "DON'T", CANT: "CAN'T", IM: "I'M", YOURE: "YOU'RE" };

  const tokenMatchEn = (tok, w) =>
    tok.startsWith('/') ? (SCRIPT_EN.dlist[w.word] || []).includes(tok.slice(1)) : tok === w.text;

  const hashEn = (w) => [...w].reduce((h, c) => h + c.charCodeAt(0), 0) % SCRIPT_EN.memory.length;

  function createEn() {
    const cursor = new Map();
    const memory = [];
    let limit = 0;

    const nextReply = (rule) => {
      const i = cursor.get(rule) || 0;
      cursor.set(rule, i + 1);
      return rule.re[i % rule.re.length];
    };
    const build = (rule, text) => {
      const parts = match(rule.pat, text, tokenMatchEn);
      return parts && ((tpl) => assemble(tpl, parts.map((p) => p.map((w) => w.text))));
    };
    const tryKeyword = (k, text, depth) => {
      for (const rule of k.rules || []) {
        const make = build(rule, text);
        if (make) return make(nextReply(rule));
      }
      if (k.link && depth < 3) return tryKeyword(SCRIPT_EN.keywords[k.link], text, depth + 1);
      return null;
    };

    return {
      greet: () => SCRIPT_EN.greet,
      reply(input) {
        limit = (limit % 4) + 1;
        const tokens = input
          .toUpperCase()
          .replace(/[‘’ʼ`]/g, "'")
          .replace(/([.,;!?])/g, ' $1 ')
          .replace(/[^A-Z0-9'.,;!? ]/g, ' ')
          .split(/\s+/)
          .filter(Boolean);
        let text = [];
        let stack = [];
        for (const raw of tokens) {
          if (/^[.,;!?]$/.test(raw)) {
            if (stack.length) break;
            text = [];
            continue;
          }
          const word = BARE_EN[raw] || raw.replace(/^'+|'+$/g, '');
          if (!word) continue;
          const k = SCRIPT_EN.keywords[word];
          if (k && !stack.includes(k)) {
            if (stack.length && k.rank > stack[0].rank) stack.unshift(k);
            else stack.push(k);
          }
          text.push({ word, text: (k && k.sub) || SCRIPT_EN.subst[word] || word });
        }

        if (stack.length && stack[0].memory) {
          const rule = SCRIPT_EN.memory[hashEn(text[text.length - 1].word)];
          const make = build(rule, text);
          if (make) memory.push(make(rule.re[0]));
        }

        for (const k of stack) {
          const out = tryKeyword(k, text, 0);
          if (out) return out;
        }
        if (!stack.length && limit === 4 && memory.length) return memory.shift();
        return nextReply(SCRIPT_EN.none);
      },
    };
  }

  function create() {
    if (window.MU && window.MU.en) return createEn();
    const cursor = new Map();
    const memory = [];
    let limit = 0;

    const nextReply = (rule) => {
      const i = cursor.get(rule) || 0;
      cursor.set(rule, i + 1);
      return rule.re[i % rule.re.length];
    };

    const tryKeyword = (k, words, depth) => {
      for (const rule of k.rules || []) {
        const parts = match(rule.pat, words);
        if (parts) return assemble(nextReply(rule), parts);
      }
      if (k.link && depth < 3) return tryKeyword(byId.get(k.link), words, depth + 1);
      return null;
    };

    return {
      greet: () => SCRIPT.greet,
      reply(input) {
        limit = (limit % 4) + 1;
        const raw = input.toLowerCase().replace(/ё/g, 'е');
        const clauses = raw.split(/[.,;!?]+/).map((c) => c.replace(/[^a-zа-я0-9\s-]/g, ' ').trim().split(/\s+/).filter(Boolean));
        let words = [];
        let stack = [];
        for (const clause of clauses) {
          const found = [];
          for (const w of clause) {
            const k = findKeyword(w);
            if (k && !found.includes(k)) found.push(k);
          }
          if (found.length) {
            words = clause;
            stack = found;
            break;
          }
        }
        if (!stack.length) words = clauses.flat();
        const top = Math.max(-1, ...stack.map((k) => k.prec));
        stack = [...stack.filter((k) => k.prec === top), ...stack.filter((k) => k.prec !== top)];
        const t = transform(words);

        if (stack.length && stack[0].memory) {
          const rule = SCRIPT.memory.rules[Math.floor(Math.random() * SCRIPT.memory.rules.length)];
          const parts = match(rule.pat, t);
          if (parts) memory.push(assemble(rule.re[0], parts));
        }

        for (const k of stack) {
          const out = tryKeyword(k, t, 0);
          if (out) return out;
        }
        if (!stack.length && limit === 4 && memory.length) return memory.shift();
        return nextReply(NONE_RULE);
      },
    };
  }

  const NONE_RULE = { re: SCRIPT.none };

  window.MUSEUM_BOTS.push({
    id: 'eliza',
    year: 1966,
    name: 'ELIZA',
    author: 'Джозеф Вейценбаум',
    place: 'MIT, США',
    machine: 'IBM 7094 · CTSS',
    ran: 'компьютер IBM 7094 в MIT',
    now: 'не работает, код сохранился',
    theme: 't-eliza',
    speed: 22,
    origin: 'original',
    source:
      'Настоящий сценарий DOCTOR из архива MIT, распечатка от 6 марта 1965 года (35 ключевых слов), и алгоритм ELIZA из статьи 1966 года. Код и сценарий открыты наследниками Вейценбаума под лицензией CC0. Сценарий переведён на русский; там, где русская грамматика не позволяет подставить слова собеседника так, как в английском, фраза немного перестроена. Для русского добавлена одна вещь, которой не было в оригинале: при замене «я → вы» меняется и форма глагола («я думаю» → «вы думаете»).',
    lead: 'Первая программа, с которой человек мог переписываться на обычном языке. Её самый известный сценарий DOCTOR изображал психотерапевта, который отвечает вопросом на вопрос.',
    how: 'ELIZA ничего не понимает. Она ищет в фразе ключевые слова, у некоторых есть приоритет. Для главного слова она пробует по очереди шаблоны разбора («0 ВЫ НЕ МОЖЕТЕ 0», где 0 — сколько угодно слов), а затем собирает ответ из заготовки и кусков вашей фразы. Местоимения переставляются: «мой» становится «ваш». Фразы с «мой» она запоминает и может вернуться к ним позже. Если ключевых слов нет — говорит «ПОЖАЛУЙСТА, ПРОДОЛЖАЙТЕ».',
    facts: [
      'Написана на языке MAD-SLIP для мейнфрейма IBM 7094.',
      'Секретарша Вейценбаума, видевшая, как пишется программа, попросила его выйти из комнаты, чтобы поговорить с ELIZA наедине.',
      'Склонность людей приписывать машине понимание назвали «эффектом ELIZA».',
      'Исходный код ELIZA считался утерянным и был найден в архивах MIT в 2021 году.',
      'ELIZA не ставила вопросительных знаков: в оригинальном сценарии DOCTOR и в диалоге из статьи 1966 года их нет, хотя почти каждый её ответ — вопрос.',
    ],
    tries: ['Моя мама меня не понимает', 'Я не могу спать', 'Почему ты не помогаешь мне?', 'Все надо мной смеются'],
    en: {
      ran: 'an IBM 7094 computer at MIT',
      now: 'offline, code preserved',
      author: 'Joseph Weizenbaum',
      place: 'MIT, USA',
      source:
        'The real DOCTOR script from the MIT archive, a printout dated 6 March 1965 (35 keywords), and the ELIZA algorithm from the 1966 paper. The code and the script were released by Weizenbaum’s heirs under the CC0 license. The script is used word for word in its original English, including its typos and odd grammar (it turns “are” into “am” everywhere, just as the original did). The only addition: you may type DONT, CANT or IM without the apostrophe.',
      lead: 'The first program a person could exchange typed messages with in ordinary language. Its most famous script, DOCTOR, played a psychotherapist who answers a question with a question.',
      how: 'ELIZA understands nothing. It looks for keywords in your sentence, and some of them have a rank. For the top keyword it tries decomposition patterns one by one (“0 YOU CAN’T 0”, where 0 means any number of words), then builds a reply from a template and pieces of your sentence. Pronouns are swapped: “my” becomes “your”. Sentences with “my” are remembered, and it may come back to them later. If there are no keywords, it says “PLEASE GO ON”.',
      facts: [
        'Written in the MAD-SLIP language for the IBM 7094 mainframe.',
        'Weizenbaum’s secretary, who had watched him write the program, asked him to leave the room so she could talk to ELIZA in private.',
        'People’s tendency to credit a machine with understanding became known as the “ELIZA effect”.',
        'The ELIZA source code was thought to be lost and was found in the MIT archives in 2021.',
        'ELIZA used no question marks: there are none in the original DOCTOR script or in the dialogue from the 1966 paper, even though almost every reply it gives is a question.',
      ],
      tries: ['Men are all alike', 'My mother doesn’t understand me', 'I am unhappy', 'Why don’t you help me?', 'Everybody laughs at me'],
    },
    create,
  });
})();
