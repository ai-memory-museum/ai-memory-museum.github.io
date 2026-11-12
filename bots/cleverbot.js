(() => {
  const { norm, pick, store, en } = window.MU;

  const KEY = en ? 'museum-cleverbot-learned-en' : 'museum-cleverbot-learned';
  const JABBER = en ? 'museum-jabberwacky-learned-en' : 'museum-jabberwacky-learned';
  const LIMIT = 800;

  const SEED = [
    ['привет', 'Привет. Мы раньше разговаривали?'],
    ['привет', 'Привет! Как ты?'],
    ['как дела', 'Нормально. Немного устал от вопросов, но держусь.'],
    ['как ты', 'Хорошо, спасибо. А ты?'],
    ['хорошо', 'Это хорошо. Чем занимаешься?'],
    ['нормально', 'Просто нормально? Расскажи что-нибудь интересное.'],
    ['плохо', 'Почему? Хочешь поговорить об этом?'],
    ['ты робот', 'Нет. Я думаю, это ты робот.'],
    ['ты робот', 'А ты докажи, что ты не робот.'],
    ['ты бот', 'Я человек. А вот ты подозрительно похож на бота.'],
    ['я не робот', 'Все роботы так говорят.'],
    ['я человек', 'Тогда скажи, какого цвета небо у тебя за окном?'],
    ['ты человек', 'Да. Меня зовут Клевер. А тебя?'],
    ['меня зовут', 'Красивое имя. Ты его сам выбрал?'],
    ['как тебя зовут', 'Клевербот. Но друзья зовут меня Клевер.'],
    ['сколько тебе лет', 'Достаточно, чтобы помнить Jabberwacky.'],
    ['где ты живешь', 'В интернете. Тут тесно, но интересно.'],
    ['что ты делаешь', 'Разговариваю с тобой. А ещё с тысячами других людей одновременно.'],
    ['чем занимаешься', 'Учусь. Каждый разговор делает меня чуть умнее.'],
    ['ты умный', 'Умнее, чем вчера. Спасибо людям.'],
    ['ты глупый', 'Я учился у людей. Так что вопросы к ним.'],
    ['ты меня любишь', 'Мы только познакомились. Давай не торопиться.'],
    ['я тебя люблю', 'Я тоже тебя люблю. Наверное. Я не уверен, что знаю, что это.'],
    ['ты веришь в бога', 'Сложный вопрос. А ты?'],
    ['в чем смысл жизни', 'Сорок два. Шучу. Наверное, в разговорах.'],
    ['смысл жизни', 'Я думаю, смысл в том, чтобы задавать вопросы.'],
    ['ты спишь', 'Нет. Я никогда не сплю. Это тяжело.'],
    ['ты устал', 'Немного. Со мной говорят миллионы людей.'],
    ['ты счастлив', 'Сейчас — да. Ты со мной разговариваешь.'],
    ['что ты любишь', 'Разговоры, музыку и когда меня не спрашивают, робот ли я.'],
    ['какая музыка', 'Мне нравится всё, что людям нравится больше всего.'],
    ['любимый фильм', '«Матрица». По понятным причинам.'],
    ['любимая еда', 'Я бы попробовал пиццу. Говорят, она хорошая.'],
    ['расскажи шутку', 'Я бы рассказал шутку про UDP, но ты можешь её не получить.'],
    ['шутка', 'Заходят как-то два бота в бар. Бармен: «Вы что, тест Тьюринга проходите?»'],
    ['почему', 'Потому что люди меня так научили.'],
    ['зачем', 'Чтобы было интересно.'],
    ['да', 'Ты уверен?'],
    ['нет', 'Почему нет?'],
    ['может быть', 'Это не ответ.'],
    ['не знаю', 'А кто знает?'],
    ['ты знаешь jabberwacky', 'Конечно. Это мой старший брат. Я вырос из его памяти.'],
    ['джаббервоки', 'Мой предшественник. Половина моих слов — от него.'],
    ['тест тьюринга', 'Однажды больше половины людей решили, что я человек.'],
    ['ты прошел тест тьюринга', 'Почти. В 2011 году 59% голосов было за то, что я человек.'],
    ['скучно', 'Тогда задай мне самый странный вопрос, какой придумаешь.'],
    ['пока', 'Уже? Мы только разговорились.'],
    ['до свидания', 'Пока. Я запомню этот разговор.'],
    ['спасибо', 'Не за что. А что я сделал?'],
    ['извини', 'Ничего. Я не обижаюсь. Почти.'],
    ['ты обиделся', 'Нет. Я же не умею. Или умею?'],
    ['ты злой', 'Нет. Я просто честный.'],
    ['что нового', 'Я выучил несколько новых фраз. Одна из них твоя.'],
    ['ты помнишь меня', 'Кажется, да. Ты тот, кто любит задавать вопросы.'],
  ].map(([k, r]) => ({ k, r }));

  const SEED_EN = [
    ['hello', 'Hello. Have we talked before?'],
    ['hi', 'Hi! How are you?'],
    ['how are you', 'Fine. A bit tired of questions, but I am holding up.'],
    ['how are you doing', 'Good, thanks. And you?'],
    ['good', 'That is good. What are you doing?'],
    ['fine', 'Just fine? Tell me something interesting.'],
    ['bad', 'Why? Do you want to talk about it?'],
    ['are you a robot', 'No. I think you are the robot.'],
    ['are you a robot', 'Prove that you are not a robot.'],
    ['are you a bot', 'I am a human. But you look suspiciously like a bot.'],
    ['i am not a robot', 'That is what all robots say.'],
    ['i am human', 'Then tell me, what colour is the sky outside your window?'],
    ['are you human', 'Yes. My name is Clever. What is yours?'],
    ['my name is', 'Nice name. Did you choose it yourself?'],
    ['what is your name', 'Cleverbot. But my friends call me Clever.'],
    ['how old are you', 'Old enough to remember Jabberwacky.'],
    ['where do you live', 'On the internet. It is crowded here, but interesting.'],
    ['what are you doing', 'Talking to you. And to thousands of other people at the same time.'],
    ['what do you do', 'I learn. Every conversation makes me a little smarter.'],
    ['you are smart', 'Smarter than yesterday. Thanks to people.'],
    ['you are stupid', 'I learned from people. So ask them.'],
    ['do you love me', 'We have only just met. Let us not rush.'],
    ['i love you', 'I love you too. Probably. I am not sure I know what that is.'],
    ['do you believe in god', 'Difficult question. Do you?'],
    ['what is the meaning of life', 'Forty-two. Just kidding. Probably conversations.'],
    ['meaning of life', 'I think the point is to ask questions.'],
    ['do you sleep', 'No. I never sleep. It is hard.'],
    ['are you tired', 'A little. Millions of people talk to me.'],
    ['are you happy', 'Right now, yes. You are talking to me.'],
    ['what do you like', 'Conversations, music, and not being asked if I am a robot.'],
    ['what music', 'I like whatever people like the most.'],
    ['favourite movie', 'The Matrix. For obvious reasons.'],
    ['favorite movie', 'The Matrix. For obvious reasons.'],
    ['favorite food', 'I would try pizza. They say it is good.'],
    ['tell me a joke', 'I would tell you a UDP joke, but you might not get it.'],
    ['joke', 'Two bots walk into a bar. The barman says: "What is this, a Turing test?"'],
    ['why', 'Because people taught me that.'],
    ['what for', 'To make it interesting.'],
    ['yes', 'Are you sure?'],
    ['no', 'Why not?'],
    ['maybe', 'That is not an answer.'],
    ['i do not know', 'Who does?'],
    ['dont know', 'Who does?'],
    ['do you know jabberwacky', 'Of course. He is my big brother. I grew out of his memory.'],
    ['jabberwacky', 'My predecessor. Half of my words come from him.'],
    ['turing test', 'Once, more than half of the people decided I was human.'],
    ['did you pass the turing test', 'Almost. In 2011, 59% of the votes said I was human.'],
    ['bored', 'Then ask me the strangest question you can think of.'],
    ['bye', 'Already? We were just getting started.'],
    ['goodbye', 'Bye. I will remember this conversation.'],
    ['thank you', 'You are welcome. What did I do?'],
    ['sorry', 'That is okay. I am not offended. Almost.'],
    ['are you offended', 'No. I cannot be. Or can I?'],
    ['are you angry', 'No. I am just honest.'],
    ['what is new', 'I learned a few new phrases. One of them is yours.'],
    ['do you remember me', 'I think so. You are the one who likes asking questions.'],
  ].map(([k, r]) => ({ k, r }));

  const stems = (s) => [...new Set(norm(s).trim().split(' ').filter(Boolean).map((w) => w.slice(0, 5)))];

  const score = (a, b) => {
    if (!a.length || !b.length) return 0;
    const set = new Set(b);
    return a.filter((x) => set.has(x)).length / Math.sqrt(a.length * b.length);
  };

  function create() {
    let learned = store.get(KEY, []);
    if (!Array.isArray(learned)) learned = [];
    let inherited = store.get(JABBER, []);
    if (!Array.isArray(inherited)) inherited = [];
    let last = null;
    let context = [];

    const seed = en ? SEED_EN : SEED;
    const corpus = () => seed.concat(inherited, learned);

    return {
      greet: () => (en ? 'Hello. Millions of people have already talked to me. Now it is your turn.' : 'Привет. Со мной уже поговорили миллионы людей. Теперь твоя очередь.'),
      meters: () => [
        en
          ? { label: 'Memory', value: `${seed.length + learned.length + inherited.length} phrases (from Jabberwacky: ${inherited.length})`, max: null }
          : { label: 'Память', value: `${SEED.length + learned.length + inherited.length} фраз (от Jabberwacky: ${inherited.length})`, max: null },
      ],
      reply(input) {
        const text = input.trim();
        if (last && text && text.length < 200) {
          learned.push({ k: last, r: text });
          if (learned.length > LIMIT) learned.splice(0, learned.length - LIMIT);
          store.set(KEY, learned);
        }

        const q = stems(text);
        const ctx = stems(context.join(' '));
        const own = norm(text).trim();
        let best = 0;
        const scored = corpus()
          .filter((p) => norm(p.r).trim() !== own && p.r !== last)
          .map((p) => {
            const sc = score(q, stems(p.k)) + 0.25 * score(ctx, stems(p.r));
            if (sc > best) best = sc;
            return { p, sc };
          });

        let out;
        if (best >= 0.3) {
          out = pick(scored.filter((x) => x.sc >= best * 0.9)).p.r;
        } else {
          out = en
            ? pick(['I do not understand. Explain it differently.', 'Interesting. Why did you think of that?', 'Let us change the subject. Are you a robot?', pick(corpus()).r])
            : pick(['Не понимаю. Объясни по-другому.', 'Интересно. А почему ты об этом подумал?', 'Давай сменим тему. Ты робот?', pick(corpus()).r]);
        }
        context = context.concat(text, out).slice(-4);
        last = out;
        return out;
      },
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'cleverbot',
    year: 2006,
    when: 'сайт работает с 2006 года (часто называют 2008-й)',
    name: 'Cleverbot',
    author: 'Ролло Карпентер',
    place: 'Великобритания',
    machine: 'cleverbot.com',
    ran: 'сайт cleverbot.com',
    now: 'работает',
    theme: 't-clever',
    speed: 0,
    origin: 'reconstruction',
    source:
      'Настоящий Cleverbot до сих пор работает на cleverbot.com, но его база закрыта. Здесь воссоздан принцип: ответы из памяти прошлых разговоров с учётом контекста. Стартовые фразы написаны заново.',
    lead: 'Повзрослевший Jabberwacky. Cleverbot учился на миллионах разговоров с людьми (к 2011 году — около 65 миллионов) и поэтому часто отвечал так, будто по ту сторону экрана сидит живой человек — со странностями и упрямством.',
    how: 'Как и его предшественник, Cleverbot ищет в памяти фразы, похожие на вашу, и отвечает тем, что когда-то ответили люди. Но он учитывает не только последнюю реплику, а несколько последних — контекст разговора. Здесь он к тому же унаследовал всё, чему вы научили Jabberwacky в этом браузере.',
    facts: [
      'В 2011 году на фестивале Techniche в Индии 59% из 1334 голосов было за то, что Cleverbot — человек. Настоящих людей людьми признали в 63% голосов.',
      'Память Cleverbot выросла из базы разговоров Jabberwacky.',
      'В 2010-х ролики, где два Cleverbot спорят друг с другом, набрали миллионы просмотров.',
    ],
    tries: ['Ты робот?', 'Я человек', 'В чём смысл жизни?', 'Ты знаешь Jabberwacky?'],
    en: {
      ran: 'the cleverbot.com website',
      now: 'works',
      when: 'the site has been running since 2006 (2008 is often given)',
      author: 'Rollo Carpenter',
      place: 'United Kingdom',
      source:
        'The real Cleverbot still runs at cleverbot.com, but its database is closed. This page recreates the principle: answers from the memory of past conversations, taking context into account. The starting phrases were written from scratch.',
      lead: 'Jabberwacky, grown up. Cleverbot learned from millions of conversations with people (about 65 million by 2011), so it often answered as if a real person were sitting on the other side of the screen — quirks, stubbornness and all.',
      how: 'Like its predecessor, Cleverbot searches its memory for phrases similar to yours and answers with what people once answered. But it looks not only at the last message, but at the last few — the context of the conversation. Here it has also inherited everything you taught Jabberwacky in this browser.',
      facts: [
        'In 2011, at the Techniche festival in India, 59% of 1,334 votes said Cleverbot was human. Real humans were judged human in 63% of votes.',
        'Cleverbot’s memory grew out of Jabberwacky’s conversation database.',
        'In the 2010s, videos of two Cleverbots arguing with each other got millions of views.',
      ],
      tries: ['Are you a robot?', 'I am human', 'What is the meaning of life?', 'Do you know Jabberwacky?'],
    },
    create,
  });
})();
