(() => {
  const { store, t } = window.MU;

  const KEY = 'museum-key-openai';
  const MODEL = 'gpt-5-mini';

  const SYSTEM = t(
    'Ты — ChatGPT. Тебя показывают в интерактивном музее истории чат-ботов AI Memory. ' +
      'Отвечай по-русски, коротко — не больше 4–5 предложений, простым текстом без Markdown: ответ показывается в окне терминала.',
    'You are ChatGPT. You are being shown in AI Memory, an interactive museum of chatbot history. ' +
      'Answer in English, briefly — no more than 4–5 sentences, in plain text without Markdown: the answer is shown in a terminal window.',
  );

  function create() {
    const history = [];
    return {
      keyed: { id: 'openai', label: t('ключ OpenAI API', 'OpenAI API key'), hint: 'sk-…', where: 'platform.openai.com' },
      greet: () => [
        t('Привет! Я ChatGPT — настоящая нейросеть OpenAI, а не воссоздание.', "Hi! I'm ChatGPT — a real OpenAI neural network, not a recreation."),
        store.get(KEY, '')
          ? t('Ключ API уже сохранён. Можно спрашивать.', 'Your API key is already saved. Ask away.')
          : t(
              'Здесь я отвечаю через API: нажмите «ключ» в рамке терминала и вставьте ключ OpenAI API — ответы оплачиваются с вашего счёта. Бесплатно поговорить со мной можно на chatgpt.com.',
              'Here I answer through the API: click “key” on the terminal frame and paste an OpenAI API key — answers are billed to your account. You can talk to me for free at chatgpt.com.',
            ),
      ],
      async reply(input) {
        const key = store.get(KEY, '');
        if (!key)
          return t(
            'Без ключа здесь я ответить не могу. Нажмите «ключ» и вставьте ключ OpenAI API (его выдают на platform.openai.com) — или поговорите со мной бесплатно на chatgpt.com.',
            "I can't answer here without a key. Click “key” and paste an OpenAI API key (you can get one at platform.openai.com) — or talk to me for free at chatgpt.com.",
          );
        history.push({ role: 'user', content: input });
        try {
          const r = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
            body: JSON.stringify({ model: MODEL, messages: [{ role: 'system', content: SYSTEM }, ...history] }),
          });
          const data = await r.json();
          if (!r.ok) {
            history.pop();
            if (r.status === 401) return t('Ключ не подошёл. Проверьте его кнопкой «ключ».', 'The key did not work. Check it with the “key” button.');
            if (r.status === 429) return t('Слишком много запросов или закончились деньги на счёте OpenAI.', 'Too many requests, or your OpenAI account is out of credit.');
            return `${t('Ошибка API', 'API error')}: ${(data.error && data.error.message) || r.status}`;
          }
          const text = ((data.choices && data.choices[0].message.content) || '').trim();
          history.push({ role: 'assistant', content: text });
          return text || '...';
        } catch {
          history.pop();
          return t('Нет связи с сервером OpenAI. Нужен интернет.', 'Cannot reach the OpenAI server. An internet connection is needed.');
        }
      },
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'chatgpt',
    year: 2022,
    name: 'ChatGPT',
    author: 'OpenAI',
    place: 'Сан-Франциско, США',
    machine: `api.openai.com · ${MODEL}`,
    ran: 'серверы OpenAI; здесь — модель gpt-5-mini',
    now: 'работает',
    theme: 't-chatgpt',
    speed: 6,
    origin: 'live',
    status: 'Работает. Бесплатно — на официальном сайте, здесь — с вашим ключом API.',
    site: 'https://chatgpt.com',
    source:
      'Настоящая модель OpenAI через API. От себя добавлена только короткая инструкция: отвечать по-русски и коротко.',
    lead: 'Чат-бот, с которого началась нынешняя эпоха ИИ. ChatGPT вышел 30 ноября 2022 года и, по оценке аналитиков UBS, уже через два месяца им пользовались 100 миллионов человек. Здесь — настоящая модель OpenAI, а не воссоздание.',
    how: 'ChatGPT работает на большой языковой модели GPT — нейросети-«трансформере», обученной на огромном количестве текстов предсказывать следующее слово. Потом её дообучили разговаривать: люди оценивали ответы, и модель училась отвечать так, как им нравится. Здесь отвечает современная модель OpenAI, а не версия 2022 года. Нужен ваш ключ API: он хранится только в этом браузере, ответы оплачиваются с вашего счёта OpenAI.',
    facts: [
      'Буквы GPT означают Generative Pre-trained Transformer — «генеративный предобученный трансформер».',
      'Архитектуру «трансформер» придумали исследователи Google в 2017 году в статье «Attention Is All You Need».',
      'Первый ChatGPT работал на модели GPT-3.5.',
      'Метод дообучения по оценкам людей называется RLHF — обучение с подкреплением на обратной связи от людей.',
    ],
    tries: ['Чем ты отличаешься от ELIZA?', 'Кто сильнее: ты или Cleverbot?', 'Объясни, что такое нейросеть', 'Расскажи шутку про 1966 год'],
    en: {
      ran: 'OpenAI servers; here, the gpt-5-mini model',
      now: 'works',
      place: 'San Francisco, USA',
      status: 'Works. Free on the official website; here, with your own API key.',
      source: 'The real OpenAI model through the API. The only thing added is a short instruction: answer in English and briefly.',
      lead: 'The chatbot that started today’s AI era. ChatGPT came out on November 30, 2022, and according to UBS analysts, just two months later 100 million people were using it. This is the real OpenAI model, not a recreation.',
      how: 'ChatGPT runs on GPT, a large language model — a “transformer” neural network trained on a huge amount of text to predict the next word. Then it was further trained to hold conversations: people rated its answers, and the model learned to answer the way they liked. Here you talk to a current OpenAI model, not the 2022 version. You need your own API key: it is stored only in this browser, and answers are billed to your OpenAI account.',
      facts: [
        'The letters GPT stand for Generative Pre-trained Transformer.',
        'The “transformer” architecture was invented by Google researchers in 2017 in the paper “Attention Is All You Need”.',
        'The first ChatGPT ran on the GPT-3.5 model.',
        'The method of further training based on human ratings is called RLHF — reinforcement learning from human feedback.',
      ],
      tries: ['How are you different from ELIZA?', 'Who is stronger: you or Cleverbot?', 'Explain what a neural network is', 'Tell me a joke about 1966'],
    },
    create,
  });
})();
