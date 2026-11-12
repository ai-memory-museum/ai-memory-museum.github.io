(() => {
  const { store, t } = window.MU;

  const SDK = 'https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.133.0/+esm';
  const KEY = 'museum-key-anthropic';

  const SYSTEM = t(
    'Ты — Claude, ИИ-помощник компании Anthropic. Тебя показывают в интерактивном музее истории чат-ботов AI Memory, ' +
      'где посетитель только что поговорил с ELIZA, PARRY, A.L.I.C.E. и другими. Отвечай по-русски, дружелюбно и коротко — ' +
      'не больше 4–5 предложений. Пиши простым текстом без Markdown: ответ показывается в окне старого терминала.',
    'You are Claude, an AI assistant made by Anthropic. You are being shown in AI Memory, an interactive museum of chatbot history, ' +
      'where the visitor has just talked to ELIZA, PARRY, A.L.I.C.E. and others. Answer in English, in a friendly way and briefly — ' +
      'no more than 4–5 sentences. Write in plain text without Markdown: the answer is shown in an old terminal window.',
  );

  function create() {
    const history = [];
    let sdk = null;
    let client = null;
    let clientKey = null;

    const connect = async (key) => {
      if (!sdk) sdk = (await import(SDK)).default;
      if (!client || clientKey !== key) {
        client = new sdk({ apiKey: key, dangerouslyAllowBrowser: true });
        clientKey = key;
      }
      return client;
    };

    return {
      keyed: { id: 'anthropic', label: t('ключ Anthropic API', 'Anthropic API key'), hint: 'sk-ant-…', where: 'console.anthropic.com' },
      greet: () => [
        t('Здравствуйте! Я Claude — настоящая нейросеть, а не воссоздание.', "Hello! I'm Claude — a real neural network, not a recreation."),
        store.get(KEY, '')
          ? t('Ключ API уже сохранён. Спрашивайте что угодно.', 'Your API key is already saved. Ask me anything.')
          : t(
              'Здесь я отвечаю через API: нажмите «ключ» в рамке терминала и вставьте ключ Anthropic API — ответы оплачиваются с вашего счёта. Бесплатно поговорить со мной можно на claude.ai.',
              'Here I answer through the API: click “key” on the terminal frame and paste an Anthropic API key — answers are billed to your account. You can talk to me for free at claude.ai.',
            ),
      ],
      async reply(input) {
        const key = store.get(KEY, '');
        if (!key)
          return t(
            'Без ключа здесь я ответить не могу. Нажмите «ключ» и вставьте ключ Anthropic API (его выдают на console.anthropic.com) — или поговорите со мной бесплатно на claude.ai.',
            "I can't answer here without a key. Click “key” and paste an Anthropic API key (you can get one at console.anthropic.com) — or talk to me for free at claude.ai.",
          );
        history.push({ role: 'user', content: input });
        try {
          const c = await connect(key);
          const r = await c.beta.messages.create({
            model: 'claude-opus-5-5',
            max_tokens: 4000,
            system: SYSTEM,
            messages: history,
            output_config: { effort: 'low' },
            betas: ['server-side-fallback-2026-07-01'],
            fallbacks: 'default',
          });
          if (r.stop_reason === 'refusal') {
            history.pop();
            return t('Claude не стал отвечать на это сообщение. Попробуйте спросить по-другому.', 'Claude declined to answer this message. Try asking in a different way.');
          }
          history.push({ role: 'assistant', content: r.content });
          const text = r.content
            .filter((b) => b.type === 'text')
            .map((b) => b.text)
            .join('')
            .trim();
          return text || '...';
        } catch (e) {
          history.pop();
          if (sdk && e instanceof sdk.AuthenticationError) return t('Ключ не подошёл. Проверьте его кнопкой «ключ».', 'The key did not work. Check it with the “key” button.');
          if (sdk && e instanceof sdk.RateLimitError) return t('Слишком много запросов. Подождите немного и попробуйте снова.', 'Too many requests. Wait a little and try again.');
          if (sdk && e instanceof sdk.APIConnectionError) return t('Нет связи с сервером Anthropic. Нужен интернет.', 'Cannot reach the Anthropic server. An internet connection is needed.');
          if (sdk && e instanceof sdk.APIError) return `${t('Ошибка API', 'API error')}: ${e.message}`;
          return t('Не удалось загрузить библиотеку Anthropic. Нужен интернет.', 'Could not load the Anthropic library. An internet connection is needed.');
        }
      },
    };
  }

  window.MUSEUM_BOTS.push({
    id: 'claude',
    year: 2023,
    name: 'Claude',
    author: 'Anthropic',
    place: 'Сан-Франциско, США',
    machine: 'api.anthropic.com · claude-opus-5-5',
    ran: 'серверы Anthropic; здесь — модель claude-opus-5-5',
    now: 'работает',
    theme: 't-claude',
    speed: 6,
    origin: 'live',
    status: 'Работает. Бесплатно — на официальном сайте, здесь — с вашим ключом API.',
    site: 'https://claude.ai',
    source:
      'Настоящая модель Anthropic через API. От себя добавлена только короткая инструкция: отвечать по-русски и коротко.',
    lead: 'Нейросеть компании Anthropic, основанной в 2021 году бывшими сотрудниками OpenAI. С самого начала Anthropic делала ставку на безопасность: Claude учили быть полезным, честным и безвредным. Здесь — настоящая модель, а не воссоздание.',
    how: 'Claude — большая языковая модель: огромная нейросеть, обученная на текстах предсказывать следующее слово. Никаких правил «если сказали X — ответь Y» в ней нет: ответ каждый раз сочиняется заново. Для обучения поведению Anthropic придумала метод «конституционного ИИ» — модель учится по письменному списку принципов. Для разговора нужен ваш ключ API: он хранится только в этом браузере, а каждый ответ стоит небольших денег на вашем счёте Anthropic.',
    facts: [
      'Первая версия Claude вышла в марте 2023 года.',
      'Метод «конституционного ИИ» Anthropic опубликовала в 2022 году.',
      'Claude 2.1 (ноябрь 2023 года) мог прочитать за один раз около 150 тысяч слов — больше 500 страниц.',
    ],
    tries: ['Чем ты отличаешься от ELIZA?', 'Объясни, как ты устроен, как пятикласснику', 'Придумай стишок про PARRY', 'Что будет на линии лет дальше?'],
    en: {
      ran: 'Anthropic servers; here, the claude-opus-5-5 model',
      now: 'works',
      place: 'San Francisco, USA',
      status: 'Works. Free on the official website; here, with your own API key.',
      source: 'The real Anthropic model through the API. The only thing added is a short instruction: answer in English and briefly.',
      lead: 'The neural network from Anthropic, a company founded in 2021 by former OpenAI employees. From the very beginning Anthropic focused on safety: Claude was trained to be helpful, honest and harmless. This is the real model, not a recreation.',
      how: 'Claude is a large language model: a huge neural network trained on text to predict the next word. There are no “if someone says X, answer Y” rules inside it: every answer is composed from scratch. To train its behavior, Anthropic invented the “Constitutional AI” method — the model learns from a written list of principles. To chat you need your own API key: it is stored only in this browser, and each answer costs a little money on your Anthropic account.',
      facts: [
        'The first version of Claude came out in March 2023.',
        'Anthropic published the “Constitutional AI” method in 2022.',
        'Claude 2.1 (November 2023) could read about 150,000 words at once — more than 500 pages.',
      ],
      tries: ['How are you different from ELIZA?', 'Explain how you work as if I were in fifth grade', 'Write a short poem about PARRY', 'What comes next on the timeline?'],
    },
    create,
  });
})();
