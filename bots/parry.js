(() => {
  const { norm, cycler } = window.MU;

  const TRIG = [
    ['insult', /(псих|сумасшед|ненормальн|дурак|идиот|параноик|бред|врешь|врете|лжец|шизо|чокнут|тупой|крыш)/],
    ['kind', /(понимаю|сочувств|верю|помочь|помогу|друг|доверя|жаль|не бойтесь|не бойся|в безопасност|все хорошо)/],
    ['mafia', /(мафи|бандит|гангстер|преступ|убий|банд|киллер|отомст)/],
    ['police', /(полиц|мент|копы|тюрьм|арест|суд )/],
    ['horses', /(лошад|скачк|ставк|ставит|букмекер|ипподром|азарт|пари )/],
    ['hospital', /(больниц|лечени|врач|доктор|таблетк|лекарств|психиатр|диагноз|палат)/],
    ['name', /(зовут|ваше имя|твое имя|кто вы|кто ты)/],
    ['age', /(сколько вам|сколько тебе|возраст|лет вам|лет тебе)/],
    ['work', /(работ|професси|чем занима)/],
    ['hello', /(привет|здравствуй|добрый)/],
    ['feel', /(как вы себя|как ты себя|как дела|самочувств|как вы )/],
    ['why', /(почему|зачем)/],
  ];

  const LINES = {
    insult: {
      calm: ['Я не сумасшедший.', 'Зачем вы так говорите?', 'Мне не нравится, когда так говорят.'],
      hot: ['Вы такой же, как все они.', 'Хватит меня оскорблять.', 'Ещё одно слово — и я ухожу.'],
    },
    kind: {
      calm: ['Ну... спасибо.', 'Может быть, вам и можно доверять.', 'Вы кажетесь нормальным человеком.'],
      hot: ['Все так говорят, а потом...', 'Не знаю, верить вам или нет.', 'Ладно. Допустим.'],
    },
    police: {
      calm: ['Полиция ничего не делает.', 'Копы покрывают своих.', 'Полиция арестовывает не тех, кого надо.'],
      hot: ['Полиция с ними заодно, вы разве не знали?', 'Не впутывайте сюда полицию.'],
    },
    hospital: {
      calm: ['Мне здесь не место.', 'Врачи думают, что знают всё.', 'Я не просил меня сюда класть.'],
      hot: ['Вы тоже из персонала? Тогда я молчу.', 'Таблетки мне не нужны. Мне нужно, чтобы от меня отстали.'],
    },
    name: { calm: ['Зовите меня просто Пэрри.'], hot: ['А вам зачем моё имя?'] },
    age: { calm: ['Мне двадцать восемь.'], hot: ['Какая разница, сколько мне лет?'] },
    work: {
      calm: ['Я работаю на почте. Сортирую письма.', 'На почте. Скучная работа, но честная.'],
      hot: ['На почте. И не спрашивайте, кто мне пишет.'],
    },
    hello: { calm: ['Здравствуйте.', 'Ну, привет.'], hot: ['Опять вы.'] },
    feel: {
      calm: ['Нормально. Только нервы немного шалят.', 'Я в порядке. Просто люди вокруг какие-то странные.'],
      hot: ['Как я себя чувствую? За мной следят — вот как.'],
    },
    why: {
      calm: ['Не знаю. Так получилось.', 'Почему вы всё время спрашиваете «почему»?'],
      hot: ['А вам-то что?', 'Почему вам так интересно?'],
    },
    evade: {
      calm: ['Не понимаю, к чему вы клоните.', 'Хм.', 'Может быть.', 'Я не хочу об этом говорить.', 'И что?'],
      hot: ['Почему вы об этом спрашиваете?', 'Вы что-то знаете?', 'Говорите прямо, что вам надо.', 'Я за вами слежу.'],
    },
  };

  const STORY = [
    'Знаете, я раньше часто ходил на скачки.',
    'На ипподроме ставки принимает букмекер. Один из них меня обманул.',
    'Он не заплатил мне выигрыш. Я его ударил. Нечего было жульничать.',
    'Потом до меня дошло: этот букмекер связан с мафией.',
    'Теперь они меня ищут. Я знаю, они хотят отомстить.',
    'Иногда мне кажется, что и здесь есть их люди.',
  ];

  const TRIG_EN = [
    ['insult', /(crazy|insane|nuts|lunatic|idiot|stupid|dumb|fool|paranoid|delusion|nonsense|liar|lying|psycho|schizo|loony|mad )/],
    ['kind', /(understand|sympath|believe you|help|friend|trust|sorry| don t be afraid|you re safe|you are safe|it s ok|it s all right|everything is fine)/],
    ['mafia', /(mafia|mob |mobster|gangster|criminal|crook|murder|kill|gang|hitman|revenge|get even|underworld)/],
    ['police', /(police|cop |cops|jail|prison|arrest|court )/],
    ['horses', /(horse|races|racing|racetrack|track|bet |bets|betting|bookie|gambl|wager)/],
    ['hospital', /(hospital|treatment|doctor|pill|medicine|medication|psychiatr|diagnos| ward )/],
    ['name', /( name |who are you)/],
    ['age', /(how old|your age)/],
    ['work', /( work|job |occupation|for a living)/],
    ['hello', /( hi | hello | hey |good morning|good afternoon|good evening)/],
    ['feel', /(how do you feel|how are you|how s it going|feeling)/],
    ['why', /( why )/],
  ];

  const LINES_EN = {
    insult: {
      calm: ['I AM NOT CRAZY.', 'WHY DO YOU SAY THAT?', 'I DON\'T LIKE IT WHEN PEOPLE SAY THAT.'],
      hot: ['YOU ARE JUST LIKE THE REST OF THEM.', 'STOP INSULTING ME.', 'ONE MORE WORD AND I\'M LEAVING.'],
    },
    kind: {
      calm: ['WELL... THANKS.', 'MAYBE I CAN TRUST YOU.', 'YOU SEEM LIKE A DECENT PERSON.'],
      hot: ['EVERYBODY SAYS THAT, AND THEN...', 'I DON\'T KNOW WHETHER TO BELIEVE YOU.', 'ALL RIGHT. SUPPOSE SO.'],
    },
    police: {
      calm: ['THE POLICE DON\'T DO ANYTHING.', 'COPS COVER FOR THEIR OWN.', 'THE POLICE ARREST THE WRONG PEOPLE.'],
      hot: ['THE POLICE ARE IN ON IT WITH THEM. DIDN\'T YOU KNOW?', 'DON\'T DRAG THE POLICE INTO THIS.'],
    },
    hospital: {
      calm: ['I SHOULDN\'T BE HERE.', 'DOCTORS THINK THEY KNOW EVERYTHING.', 'I NEVER ASKED TO BE PUT IN HERE.'],
      hot: ['ARE YOU ONE OF THE STAFF TOO? THEN I\'M NOT TALKING.', 'I DON\'T NEED PILLS. I NEED PEOPLE TO LEAVE ME ALONE.'],
    },
    name: { calm: ['JUST CALL ME PARRY.'], hot: ['WHY DO YOU WANT MY NAME?'] },
    age: { calm: ['I\'M TWENTY-EIGHT.'], hot: ['WHAT DIFFERENCE DOES MY AGE MAKE?'] },
    work: {
      calm: ['I WORK AT THE POST OFFICE. I SORT MAIL.', 'AT THE POST OFFICE. A BORING JOB, BUT AN HONEST ONE.'],
      hot: ['AT THE POST OFFICE. AND DON\'T ASK WHO WRITES TO ME.'],
    },
    hello: { calm: ['HELLO.', 'WELL, HI.'], hot: ['YOU AGAIN.'] },
    feel: {
      calm: ['ALL RIGHT. MY NERVES ARE A LITTLE ON EDGE.', 'I\'M FINE. IT\'S JUST THAT PEOPLE AROUND HERE ARE STRANGE.'],
      hot: ['HOW DO I FEEL? I\'M BEING WATCHED, THAT\'S HOW.'],
    },
    why: {
      calm: ['I DON\'T KNOW. IT JUST HAPPENED.', 'WHY DO YOU KEEP ASKING "WHY"?'],
      hot: ['WHAT\'S IT TO YOU?', 'WHY ARE YOU SO INTERESTED?'],
    },
    evade: {
      calm: ['I DON\'T SEE WHAT YOU ARE GETTING AT.', 'HM.', 'MAYBE.', 'I DON\'T WANT TO TALK ABOUT IT.', 'SO WHAT?'],
      hot: ['WHY DO YOU ASK THAT?', 'DO YOU KNOW SOMETHING?', 'SAY STRAIGHT OUT WHAT YOU WANT.', 'I\'M KEEPING AN EYE ON YOU.'],
    },
  };

  const STORY_EN = [
    'YOU KNOW, I USED TO GO TO THE RACES A LOT.',
    'AT THE TRACK A BOOKIE TAKES THE BETS. ONE OF THEM CHEATED ME.',
    'HE DIDN\'T PAY ME MY WINNINGS. I HIT HIM. HE HAD NO BUSINESS CHEATING.',
    'THEN IT DAWNED ON ME: THAT BOOKIE IS CONNECTED TO THE MAFIA.',
    'NOW THEY ARE LOOKING FOR ME. I KNOW THEY WANT REVENGE.',
    'SOMETIMES I THINK SOME OF THEIR PEOPLE ARE HERE TOO.',
  ];

  const TEXT = {
    ru: {
      told: 'Я уже всё вам рассказал. Вы мне не верите?',
      greet: 'Ну? Чего вам?',
      meters: ['Страх', 'Гнев', 'Недоверие'],
      silent: '(Пэрри молчит и смотрит в стену.)',
      mafiaNew: 'Мафия? Почему вы спросили про мафию? Вы что-то знаете?',
      mafiaOld: 'Мафия — страшные люди. Они знают, где я.',
      end: 'Всё. Я с вами больше не разговариваю.',
    },
    en: {
      told: 'I\'VE ALREADY TOLD YOU EVERYTHING. DON\'T YOU BELIEVE ME?',
      greet: 'WELL? WHAT DO YOU WANT?',
      meters: ['Fear', 'Anger', 'Mistrust'],
      silent: '(PARRY says nothing and stares at the wall.)',
      mafiaNew: 'THE MAFIA? WHY DID YOU ASK ABOUT THE MAFIA? DO YOU KNOW SOMETHING?',
      mafiaOld: 'THE MAFIA ARE DANGEROUS PEOPLE. THEY KNOW WHERE I AM.',
      end: 'THAT\'S IT. I\'M NOT TALKING TO YOU ANYMORE.',
    },
  };

  const clamp = (v) => Math.max(0, Math.min(20, v));

  function create() {
    const next = cycler();
    const en = window.MU.en;
    const trig = en ? TRIG_EN : TRIG;
    const lines = en ? LINES_EN : LINES;
    const tale = en ? STORY_EN : STORY;
    const tx = en ? TEXT.en : TEXT.ru;
    const s = { fear: 3, anger: 3, mistrust: 6, stage: 0, ended: false };

    const hot = () => s.anger >= 10 || s.fear >= 11 || s.mistrust >= 12;
    const say = (cat) => {
      const tone = hot() && lines[cat].hot ? 'hot' : 'calm';
      return next(cat + tone, lines[cat][tone]);
    };
    const story = () => {
      if (s.stage >= tale.length) return tx.told;
      return tale[s.stage++];
    };

    return {
      greet: () => tx.greet,
      meters: () => [
        { label: tx.meters[0], value: s.fear, max: 20 },
        { label: tx.meters[1], value: s.anger, max: 20 },
        { label: tx.meters[2], value: s.mistrust, max: 20 },
      ],
      reply(input) {
        if (s.ended) return tx.silent;
        const t = norm(input);
        const hit = trig.find(([, re]) => re.test(t));
        const cat = hit ? hit[0] : null;
        let out;

        if (cat === 'insult') {
          s.anger += 4; s.mistrust += 2;
          out = say('insult');
        } else if (cat === 'kind') {
          s.anger -= 2; s.fear -= 1; s.mistrust -= 2;
          out = say('kind');
        } else if (cat === 'mafia') {
          s.fear += 3; s.mistrust += 1;
          out = s.stage < 3 ? tx.mafiaNew : tx.mafiaOld;
          if (s.stage < 3) s.stage = 3;
        } else if (cat === 'horses') {
          s.fear += 1;
          out = story();
        } else if (cat === 'police') {
          s.fear += 1; s.mistrust += 1;
          out = say('police');
        } else if (cat === 'hospital') {
          s.mistrust += 2; s.anger += 1;
          out = say('hospital');
        } else if (cat) {
          out = say(cat);
        } else if (!hot() && Math.random() < 0.45) {
          s.fear += 1;
          out = story();
        } else {
          s.mistrust += 1;
          out = say('evade');
        }

        if (cat !== 'insult') s.anger -= 1;
        if (cat !== 'mafia' && cat !== 'horses') s.fear -= 0.5;
        s.fear = clamp(s.fear); s.anger = clamp(s.anger); s.mistrust = clamp(s.mistrust);

        if (s.anger >= 15) {
          s.ended = true;
          return [out, tx.end];
        }
        return out;
      },
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'parry',
    year: 1972,
    name: 'PARRY',
    author: 'Кеннет Колби',
    place: 'Стэнфорд, США',
    machine: 'PDP-10 · SAIL',
    ran: 'компьютер PDP-10 в Стэнфорде',
    now: 'не работает, код сохранился',
    theme: 't-parry',
    speed: 26,
    origin: 'reconstruction',
    source:
      'Исходный код PARRY начала 1970-х сохранился в архиве Университета Карнеги — Меллон, но лицензии у него нет, а написан он на MLISP для PDP-10. Здесь по описаниям воссоздан только принцип: три переменные — страх, гнев, недоверие — и история о букмекере и мафии. Все фразы написаны заново.',
    lead: 'Если ELIZA играла врача, то PARRY играл пациента. Психиатр Кеннет Колби смоделировал человека с параноидной шизофренией, который уверен, что за ним охотится мафия.',
    how: 'Внутри PARRY три переменные: страх, гнев и недоверие. В оригинале страх растёт от угроз, гнев — от обид, а недоверие складывается из страха и гнева. От этих чисел зависит тон ответов. Если собеседник молчит о важном, PARRY сам сворачивает на свою историю о букмекере. Шкалы справа — его «нервы» в реальном времени.',
    facts: [
      'Психиатрам показали распечатки бесед с PARRY и с настоящими пациентами. Психиатры угадали, где программа, в 21 случае из 41 — примерно в половине, почти как наугад.',
      'Сами авторы называли эти опыты лишь похожими на тест Тьюринга: настоящую «игру в имитацию» они не проводили.',
      'В 1972 году PARRY и ELIZA «поговорили» друг с другом через ARPANET — предшественник интернета.',
      'Если довести PARRY до предела гнева, он прекращает разговор.',
    ],
    tries: ['Как вас зовут?', 'Вы ходите на скачки?', 'Почему вы в больнице?', 'Вы сумасшедший'],
    en: {
      ran: 'a PDP-10 computer at Stanford',
      now: 'offline, code preserved',
      author: 'Kenneth Colby',
      place: 'Stanford, USA',
      source:
        'The original early-1970s PARRY source code survives in the Carnegie Mellon University archive, but it has no license and is written in MLISP for the PDP-10. Here only the principle is rebuilt from descriptions: three variables — fear, anger and mistrust — and the story about the bookie and the Mafia. All the lines are newly written.',
      lead: 'If ELIZA played the doctor, PARRY played the patient. Psychiatrist Kenneth Colby modeled a person with paranoid schizophrenia who is convinced the Mafia is after him.',
      how: 'Inside PARRY there are three variables: fear, anger and mistrust. In the original, fear grows from threats, anger from insults, and mistrust is made up of fear and anger. The tone of the answers depends on these numbers. If the other person stays silent about what matters, PARRY steers the talk to his own story about the bookie. The meters on the right are his “nerves” in real time.',
      facts: [
        'Psychiatrists were shown transcripts of conversations with PARRY and with real patients. They guessed which one was the program in 21 cases out of 41 — about half, almost like random guessing.',
        'The authors themselves called these experiments only similar to the Turing test: they did not run a real “imitation game”.',
        'In 1972 PARRY and ELIZA “talked” to each other over ARPANET, the forerunner of the internet.',
        'If you push PARRY to the limit of his anger, he ends the conversation.',
      ],
      tries: ['What is your name?', 'Do you go to the races?', 'Why are you in the hospital?', 'You are crazy'],
    },
    create,
  });
})();
