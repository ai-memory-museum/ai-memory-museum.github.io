(() => {
  const { t, en, store } = window.MU;
  document.documentElement.lang = window.MU.lang;
  document.title = t('AI Memory — математика ботов', 'AI Memory — the maths of bots');
  const langBtn = document.getElementById('langBtn');
  langBtn.textContent = en ? 'RU' : 'EN';
  langBtn.addEventListener('click', () => {
    store.set('museum-lang', en ? 'ru' : 'en');
    history.replaceState(null, '', location.pathname + location.hash);
    location.reload();
  });

  const TEXT = t(
    'Кошка спит на диване. Кошка ест рыбу. Собака спит на полу. Собака ест кость. Кошка любит рыбу.',
    'The cat sleeps on the sofa. The cat eats fish. The dog sleeps on the floor. The dog eats a bone. The cat likes fish.',
  );

  const root = document.getElementById('math');
  root.innerHTML = `
    <a class="back" href="index.html">${t('← к линии и разговору', '← back to the timeline')}</a>
    <h2>${t('Математика ботов', 'The maths of bots')}</h2>
    <p class="lead">${t(
      'Внутри любого чат-бота — математика. За 60 лет она прошла три шага: сначала правила, потом вероятности, потом нейросети. Здесь каждый шаг можно потрогать руками.',
      'Every chatbot has maths inside. Over 60 years it went through three steps: first rules, then probabilities, then neural networks. Here you can try each step yourself.',
    )}</p>

    <section>
      <h3>${t('Шаг 1. Правила: «если — то»', 'Step 1. Rules: “if — then”')}</h3>
      <p>${t(
        'ELIZA (1966) ничего не считала, она проверяла условия. Если во фразе есть ключевое слово, программа берёт заготовленный ответ. У ключевых слов есть приоритет — число: когда в фразе их несколько, побеждает то, у которого число больше. Это чистая логика: условие и сравнение чисел.',
        'ELIZA (1966) did not calculate anything; it checked conditions. If a sentence contains a keyword, the program takes a prepared answer. Keywords have a priority — a number: when a sentence has several, the one with the bigger number wins. This is pure logic: a condition and a comparison of numbers.',
      )}</p>
      <div class="formula">${t('если в фразе есть «мама» → «РАССКАЖИТЕ ПОДРОБНЕЕ О ВАШЕЙ СЕМЬЕ»', 'if the sentence contains “mother” → “TELL ME MORE ABOUT YOUR FAMILY”')}</div>
      <p>${t(
        'PARRY (1972) добавил числа: страх, гнев и недоверие. Каждая ваша фраза прибавляет или отнимает от них, а ответ зависит от того, какое число больше. Чувства стали переменными.',
        'PARRY (1972) added numbers: fear, anger and mistrust. Each of your sentences adds to them or takes away, and the answer depends on which number is bigger. Feelings became variables.',
      )}</p>
    </section>

    <section>
      <h3>${t('Шаг 2. Вероятности: цепь Маркова', 'Step 2. Probabilities: a Markov chain')}</h3>
      <p>${t(
        'Следующий шаг — не писать правила, а посчитать их по тексту. Программа смотрит, какое слово сколько раз шло после другого, и превращает это в вероятности. Так работал, например, MegaHAL (1995). Попробуйте: впишите свой текст или оставьте наш.',
        'The next step: do not write rules, count them from a text. The program looks at how many times each word came after another and turns it into probabilities. MegaHAL (1995), for example, worked this way. Try it: type your own text or keep ours.',
      )}</p>
      <textarea id="mkText" rows="4" spellcheck="false">${TEXT}</textarea>
      <div class="mk-buttons">
        <button type="button" id="mkBuild">${t('Посчитать таблицу', 'Count the table')}</button>
        <button type="button" id="mkGen">${t('Сочинить фразу', 'Make up a sentence')}</button>
      </div>
      <div id="mkOut" aria-live="polite"></div>
      <div id="mkTable"></div>
    </section>

    <section>
      <h3>${t('Шаг 3. Нейросети: нейрон — это сложение и умножение', 'Step 3. Neural networks: a neuron is addition and multiplication')}</h3>
      <p>${t(
        'В 1943 году Уоррен Маккаллок и Уолтер Питтс описали искусственный нейрон: он умножает каждый входящий сигнал на его «вес», складывает и сравнивает с порогом. В 1958 году Фрэнк Розенблатт построил перцептрон — нейрон, который учится: если он ошибся, веса немного меняются. Попробуйте сами: нейрон решает, идти ли гулять.',
        'In 1943 Warren McCulloch and Walter Pitts described an artificial neuron: it multiplies each incoming signal by its “weight”, adds them up and compares the sum with a threshold. In 1958 Frank Rosenblatt built the perceptron — a neuron that learns: when it makes a mistake, its weights change a little. Try it: the neuron decides whether to go for a walk.',
      )}</p>
      <div class="neuron" id="neuron"></div>
      <p>${t(
        'Нейросеть — это много таких нейронов в несколько слоёв. «Обучение» — это подбор весов, чтобы ошибок стало меньше. У современных моделей вроде ChatGPT таких весов миллиарды. И считают они то же, что цепь Маркова в шаге 2, — вероятность следующего слова, только смотрят не на одно предыдущее слово, а на весь текст разговора.',
        'A neural network is many such neurons in several layers. “Training” means choosing the weights so that there are fewer mistakes. Modern models like ChatGPT have billions of weights. And they calculate the same thing as the Markov chain in step 2 — the probability of the next word — only they look not at one previous word but at the whole conversation.',
      )}</p>
    </section>

    <a class="talk" href="index.html#compare">${t('Сравнить ботов на одном вопросе →', 'Compare the bots on one question →')}</a>`;

  // Цепь Маркова
  const END = '.';
  const words = (s) => s.toLowerCase().replace(/[!?]/g, '.').match(/[a-zа-яё0-9-]+|\./g) || [];
  let chain = null;

  function build() {
    const tok = words(document.getElementById('mkText').value);
    const next = new Map();
    const starts = new Map();
    let prev = END;
    tok.forEach((w) => {
      if (prev === END) {
        if (w !== END) starts.set(w, (starts.get(w) || 0) + 1);
      } else {
        if (!next.has(prev)) next.set(prev, new Map());
        next.get(prev).set(w, (next.get(prev).get(w) || 0) + 1);
      }
      prev = w;
    });
    chain = { next, starts, text: tok.join(' ') };
    const total = (m) => [...m.values()].reduce((a, b) => a + b, 0);
    const cell = (m) => {
      const n = total(m);
      return [...m.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([w, c]) => `<span class="mk-pair"><b>${w === END ? t('конец', 'end') : w}</b> ${c}/${n} = ${Math.round((c / n) * 100)}%</span>`)
        .join('');
    };
    document.getElementById('mkTable').innerHTML = chain.next.size
      ? `<table class="mk-table"><thead><tr><th>${t('после слова', 'after the word')}</th><th>${t('идёт слово (сколько раз из скольких)', 'comes the word (how many times out of how many)')}</th></tr></thead><tbody>
        ${[...chain.next.entries()].map(([w, m]) => `<tr><td>${w}</td><td>${cell(m)}</td></tr>`).join('')}
        </tbody></table>`
      : `<p class="mk-note">${t('Текст слишком короткий.', 'The text is too short.')}</p>`;
    document.getElementById('mkOut').innerHTML = '';
  }

  function pick(m) {
    const n = [...m.values()].reduce((a, b) => a + b, 0);
    let r = Math.random() * n;
    for (const [w, c] of m) {
      r -= c;
      if (r < 0) return [w, c, n];
    }
    const [w, c] = [...m.entries()].pop();
    return [w, c, n];
  }

  function generate() {
    if (!chain) build();
    if (!chain.starts.size) return;
    const steps = [];
    let [w, c, n] = pick(chain.starts);
    steps.push({ w, c, n, first: true });
    for (let i = 0; i < 20 && chain.next.has(w); i++) {
      [w, c, n] = pick(chain.next.get(w));
      if (w === END) break;
      steps.push({ w, c, n });
    }
    const phrase = steps.map((s) => s.w).join(' ');
    const isNew = !chain.text.includes(phrase + ' .');
    const frac = steps.filter((s) => !s.first).map((s) => `${s.c}/${s.n}`);
    const p = steps.filter((s) => !s.first).reduce((a, s) => a * (s.c / s.n), 1);
    document.getElementById('mkOut').innerHTML = `
      <p class="mk-phrase">${phrase.charAt(0).toUpperCase() + phrase.slice(1)}.</p>
      <p class="mk-steps">${steps.map((s, i) => (i ? `→ <b>${s.w}</b> <span>(${s.c}/${s.n})</span>` : `<b>${s.w}</b>`)).join(' ')}</p>
      <p class="mk-note">${
        frac.length
          ? `${t('Вероятность выбрать такую цепочку после первого слова', 'The probability of this chain after the first word')}: ${frac.join(' × ')} = ${Math.round(p * 1000) / 10}%. `
          : ''
      }${isNew ? t('Такой фразы в тексте не было — программа её «сочинила».', 'This sentence was not in the text — the program “made it up”.') : t('Эта фраза есть в тексте целиком.', 'This exact sentence is in the text.')} ${t('Цепь помнит только одно предыдущее слово, поэтому иногда выходит чепуха. Нажмите ещё раз.', 'The chain remembers only one previous word, so sometimes it talks nonsense. Press again.')}</p>`;
  }

  document.getElementById('mkBuild').addEventListener('click', build);
  document.getElementById('mkGen').addEventListener('click', generate);
  build();

  // Нейрон
  const INPUTS = [
    { name: t('солнечно', 'it is sunny'), w: 2 },
    { name: t('выходной', 'it is a day off'), w: 1 },
    { name: t('много домашки', 'lots of homework'), w: -2 },
  ];
  const state = { x: [1, 0, 1], w: INPUTS.map((i) => i.w), th: 1 };
  const neuron = document.getElementById('neuron');

  neuron.innerHTML = `
    ${INPUTS.map(
      (inp, i) => `<div class="nr-row">
        <label class="nr-in"><input type="checkbox" data-x="${i}" ${state.x[i] ? 'checked' : ''}> ${inp.name} <span data-xv="${i}"></span></label>
        <label class="nr-w">${t('вес', 'weight')} <input type="range" min="-3" max="3" step="1" value="${state.w[i]}" data-w="${i}"> <b data-wv="${i}"></b></label>
      </div>`,
    ).join('')}
    <div class="nr-row"><span class="nr-in">${t('порог', 'threshold')}</span><label class="nr-w"><input type="range" min="-3" max="5" step="1" value="${state.th}" data-th> <b data-thv></b></label></div>
    <div class="formula" data-f></div>
    <p class="nr-out" data-out></p>`;

  function drawNeuron() {
    const sum = state.x.reduce((a, x, i) => a + x * state.w[i], 0);
    const out = sum >= state.th;
    state.x.forEach((x, i) => {
      neuron.querySelector(`[data-xv="${i}"]`).textContent = `(x = ${x})`;
      neuron.querySelector(`[data-wv="${i}"]`).textContent = state.w[i];
    });
    neuron.querySelector('[data-thv]').textContent = state.th;
    neuron.querySelector('[data-f]').innerHTML = `${state.x.map((x, i) => `${x}×${state.w[i] < 0 ? `(${state.w[i]})` : state.w[i]}`).join(' + ')} = <b>${sum}</b> ${out ? '≥' : '<'} ${state.th}`;
    const o = neuron.querySelector('[data-out]');
    o.className = 'nr-out ' + (out ? 'yes' : 'no');
    o.textContent = out ? t('Нейрон: 1 — идём гулять', 'Neuron: 1 — let’s go for a walk') : t('Нейрон: 0 — остаёмся дома', 'Neuron: 0 — staying at home');
  }
  neuron.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.x !== undefined) state.x[+el.dataset.x] = el.checked ? 1 : 0;
    if (el.dataset.w !== undefined) state.w[+el.dataset.w] = +el.value;
    if (el.dataset.th !== undefined) state.th = +el.value;
    drawNeuron();
  });
  drawNeuron();
})();
