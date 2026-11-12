(() => {
  const { t, en } = window.MU;
  const ROUNDS = window.TURING_ROUNDS;
  const SRC = window.TURING_SOURCES;
  const box = document.getElementById('turingBox');
  document.documentElement.lang = window.MU.lang;
  document.title = t('AI Memory — тест Тьюринга', 'AI Memory — the Turing test');
  const langBtn = document.getElementById('langBtn');
  langBtn.textContent = en ? 'RU' : 'EN';
  langBtn.addEventListener('click', () => {
    window.MU.store.set('museum-lang', en ? 'ru' : 'en');
    history.replaceState(null, '', location.pathname + location.hash);
    location.reload();
  });
  document.getElementById('turingBack').textContent = t('← к линии и разговору', '← back to the timeline');
  document.getElementById('turingTitle').textContent = t('Тест Тьюринга', 'Turing test');
  document.getElementById('turingLead').textContent = t(
    'В 1950 году Алан Тьюринг предложил «игру в имитацию»: судья переписывается со скрытыми собеседниками и должен отличить машину от человека. Теперь судья — вы.',
    'In 1950 Alan Turing proposed the “imitation game”: a judge chats with hidden partners and has to tell the machine from the human. Now you are the judge.',
  );
  const pick = (pair) => (en ? pair[1] : pair[0]);
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  let game;

  function shuffle(list) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function order() {
    const first = window.MU.store.get('museum-turing-first', -1);
    let a;
    const all = ROUNDS.map((_, i) => i);
    const big = all.filter((i) => !ROUNDS[i].final && ROUNDS[i].chats.length > 2);
    const last = all.filter((i) => ROUNDS[i].final);
    const rest = all.filter((i) => !ROUNDS[i].final && ROUNDS[i].chats.length <= 2);
    do a = [...shuffle(rest), ...big, ...last];
    while (rest.length > 1 && a[0] === first);
    window.MU.store.set('museum-turing-first', a[0]);
    return a;
  }

  function verdict(s, all) {
    if (s === all) return t('Идеально! Ни одна программа вас не обманула — вы оказались строже настоящих судей.', 'Perfect! Not a single program fooled you — you were stricter than the real judges.');
    if (s >= all - 2) return t('Отличный результат. Вы почти всегда находили человека, хотя настоящие судьи в этих же разговорах часто ошибались.', 'Great result. You almost always found the human, even though the real judges often got these same chats wrong.');
    if (s >= Math.ceil(all / 2) - 1) return t('Примерно как настоящие судьи: иногда угадывали, иногда нет. По короткой переписке машину отличить трудно — на это и рассчитывал Тьюринг.', 'About as good as the real judges: sometimes right, sometimes not. It is hard to spot a machine in a short chat — just as Turing expected.');
    if (s > 0) return t('Программы обманывали вас часто — но не расстраивайтесь: настоящих судей в этих разговорах они тоже часто обманывали.', 'The programs fooled you often — but don’t worry: they often fooled the real judges in these chats too.');
    return t('Программы победили во всех раундах! Для них это лучший результат: именно так машина проходит тест Тьюринга.', 'The programs won every round! For them that is the best result: this is exactly how a machine passes the Turing test.');
  }

  function label(s) {
    const text = en ? s.en : s.ru;
    const link = `<a href="${s.url}" target="_blank" rel="noopener">${s.cite}</a>`;
    return `<div class="tt-label tt-label-a"><span class="tt-badge">${t('Настоящая запись', 'Real transcript')}</span><p>${text} <span class="tt-src">${link}</span></p></div>`;
  }

  function dots() {
    return `<div class="guess-dots">${ROUNDS.map((_, i) => `<i class="${i < game.marks.length ? (game.marks[i] ? 'ok' : 'no') : i === game.n ? 'now' : ''}"></i>`).join('')}</div>`;
  }

  function chat(c, i) {
    return `<article class="tt-chat" data-i="${i}">
      <span class="tt-n">${t('Собеседник', 'Partner')} ${i + 1}</span>
      <div class="tt-log">${c.lines.map(([w, orig, ru]) => `<p class="tt-${w}">${esc(en ? orig : ru)}</p>`).join('')}</div>
      <div class="tt-reveal"></div>
      <button type="button" class="tt-pick">${t('Это человек', 'This is the human')}</button>
    </article>`;
  }

  function round() {
    document.body.classList.add('tt-playing', 'tt-full');
    if (game.n >= ROUNDS.length) return finish();
    const base = ROUNDS[game.order[game.n]];
    const r = { ...base, chats: shuffle(base.chats) };
    const n = r.chats.length;
    box.innerHTML = `
      <div class="tt-head"><button type="button" class="tt-x" aria-label="${t('К началу', 'Start over')}">×</button>${dots()}<span>${t('раунд', 'round')} ${game.n + 1}/${ROUNDS.length} · <b>${game.score} / ${game.n}</b></span></div>
      ${r.final ? `<p class="tt-final">${t('Финальный раунд — самый сложный', 'Final round — the hardest one')}</p>` : ''}
      ${label(SRC[r.src])}
      <div class="tt-top">
        <p class="tt-ask">${n > 2 ? t('Только один из четырёх — человек. Кто?', 'Only one of the four is a human. Which one?') : t('Один из них человек, другой — программа. Кто человек?', 'One of them is a human, the other is a program. Which is the human?')}</p>
        <span><b>${game.score} / ${game.n}</b> · ${t('раунд', 'round')} ${game.n + 1} ${t('из', 'of')} ${ROUNDS.length} · <button type="button" class="tt-close">${t('к началу', 'start over')}</button></span>
      </div>
      <div class="tt-tabs">${r.chats.map((_, i) => `<button type="button">${n > 2 ? '' : t('Собеседник ', 'Partner ')}${i + 1}</button>`).join('')}</div>
      <div class="tt-grid tt-grid-${n}">${r.chats.map(chat).join('')}</div>
      <div class="tt-bar"></div>
      <div class="tt-after">${dots()}</div>`;
    box.querySelector('.tt-close').addEventListener('click', intro);
    box.querySelector('.tt-x').addEventListener('click', intro);
    const lab = box.querySelector('.tt-label-a');
    lab.addEventListener('click', (e) => {
      if (!e.target.closest('a')) lab.classList.toggle('open');
    });
    const chats = [...box.querySelectorAll('.tt-chat')];
    const tabs = [...box.querySelectorAll('.tt-tabs button')];
    const bar = box.querySelector('.tt-bar');
    const ui = { done: false, seen: new Set(), cur: 0, chats, tabs, bar };
    ui.show = (i) => {
      ui.cur = i;
      ui.seen.add(i);
      chats.forEach((c, k) => c.classList.toggle('on', k === i));
      tabs.forEach((b, k) => b.classList.toggle('on', k === i));
      chats[i].scrollTop = 0;
      if (!ui.done) choices(r, ui);
    };
    tabs.forEach((b, i) => b.addEventListener('click', () => ui.show(i)));
    box.querySelectorAll('.tt-pick').forEach((btn) => btn.addEventListener('click', () => answer(r, Number(btn.closest('.tt-chat').dataset.i), ui)));
    ui.show(0);
  }

  function choices(r, ui) {
    const n = r.chats.length;
    if (ui.seen.size < n) {
      const left = [...Array(n).keys()].filter((k) => !ui.seen.has(k));
      const next = left.find((k) => k > ui.cur) ?? left[0];
      ui.bar.innerHTML = `<p>${t('Сначала прочитайте всех, потом выберите человека', 'Read them all first, then pick the human')}</p>
        <button type="button" class="tt-go">${t('Дальше: собеседник', 'Next: partner')} ${next + 1} →</button>`;
      ui.bar.querySelector('.tt-go').addEventListener('click', () => ui.show(next));
      return;
    }
    ui.bar.innerHTML = `<p>${t('Прочитали всех? Кто из них человек?', 'Read them all? Which one is the human?')}</p>
      <div class="tt-nums">${r.chats.map((_, k) => `<button type="button">${k + 1}</button>`).join('')}</div>`;
    ui.bar.querySelectorAll('.tt-nums button').forEach((b, k) => b.addEventListener('click', () => answer(r, k, ui)));
  }

  function next() {
    game.n++;
    round();
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function answer(r, i, ui) {
    const ok = r.chats[i].human;
    if (ok) game.score++;
    game.marks.push(ok);
    box.querySelectorAll('.tt-chat').forEach((el, k) => {
      const c = r.chats[k];
      el.classList.add(c.human ? 'is-human' : 'is-machine');
      if (k === i) el.classList.add(ok ? 'picked-right' : 'picked-wrong');
      el.querySelector('.tt-pick').remove();
      el.querySelector('.tt-reveal').innerHTML = `
        <p class="tt-who">${c.human ? t('Человек', 'Human') : t('Программа', 'Program')}${pick(c.who) ? ': ' + pick(c.who) : ''}</p>
        <p class="tt-judge">${t('Судья тогда', 'The judge at the time')} ${pick(c.judge)}.</p>`;
      ui.tabs[k].classList.add(c.human ? 'is-human' : 'is-machine');
      if (k === i && !ok) ui.tabs[k].classList.add('picked-wrong');
    });
    const score = `${game.score} / ${game.n + 1}`;
    box.querySelector('.tt-top b').textContent = score;
    box.querySelector('.tt-head b').textContent = score;
    box.querySelector('.tt-head .guess-dots').outerHTML = dots();
    const last = game.n + 1 < ROUNDS.length ? t('Дальше →', 'Next →') : t('Итог →', 'Result →');
    const result = `<p class="tt-result"><b class="${ok ? 'ok' : 'no'}">${ok ? t('Верно!', 'Correct!') : t('Не угадали.', 'Wrong.')}</b> ${r.note ? pick(r.note) : ''}</p>`;
    const after = box.querySelector('.tt-after');
    after.innerHTML = `${result}${dots()}<button type="button" class="guess-next">${last}</button>`;
    after.querySelector('.guess-next').addEventListener('click', next);
    const s = SRC[r.src];
    ui.done = true;
    ui.bar.innerHTML = `${result}<p class="tt-src"><a href="${s.url}" target="_blank" rel="noopener">${s.cite}</a></p><button type="button" class="tt-go">${last}</button>`;
    ui.bar.querySelector('.tt-go').addEventListener('click', next);
    ui.show(i);
  }

  function finish() {
    document.body.classList.remove('tt-full');
    const s = game.score;
    const all = ROUNDS.length;
    box.innerHTML = `
      <div class="tt-end">
        <p class="guess-score">${s} ${t('из', 'out of')} ${all}</p>
        ${dots()}
        <p class="tt-verdict">${verdict(s, all)}</p>
        <p>${t(
          'В 1950 году Тьюринг предсказал, что примерно через 50 лет средний судья после 5 минут разговора будет угадывать правильно не больше чем в 70% случаев. В исследовании 2024 года GPT-4 принимали за человека в 54% игр, ELIZA — в 22%, а настоящих людей — в 67%. А в исследовании 2025 года GPT-4.5 выбирали человеком в 73% игр — чаще, чем самих людей.',
          'In 1950 Turing predicted that in about 50 years an average judge would have no more than a 70% chance of making the right identification after 5 minutes of questioning. In the 2024 study, GPT-4 was judged to be human in 54% of games, ELIZA in 22%, and real humans in 67%. And in the 2025 study, GPT-4.5 was picked as the human in 73% of games — more often than the humans themselves.',
        )}</p>
        <p class="tt-note">${t(
          'Все переписки настоящие и взяты из научных статей (лицензия CC BY 4.0). Перевод на русский сделан для этого музея; опечатки оригинала по возможности сохранены, пояснения переводчика — в квадратных скобках.',
          'All transcripts are real and come from scientific papers (CC BY 4.0 license). Original spelling and typos are kept.',
        )}</p>
        <ul class="tt-sources">${Object.values(SRC).map((x) => `<li><a href="${x.url}" target="_blank" rel="noopener">${x.cite}</a></li>`).join('')}</ul>
        <div class="tt-end-btns">
          <button type="button" class="guess-next" id="turingClose">${t('К началу', 'Back to start')}</button>
        </div>
      </div>`;
    document.getElementById('turingClose').addEventListener('click', intro);
  }

  function intro() {
    document.body.classList.remove('tt-playing', 'tt-full');
    box.innerHTML = `
      <div class="tt-intro">
        <span class="tt-badge">${t('Настоящие записи', 'Real transcripts')}</span>
        <p>${t(
          'Переписки взяты из настоящих тестов Тьюринга: в Королевском обществе в Лондоне в 2014 году и в исследованиях Калифорнийского университета в Сан-Диего 2023, 2024 и 2025 годов. В каждом раунде судья переписывался с человеком и с программой. Найдите человека — а потом узнаете, что тогда решил настоящий судья.',
          'The chats come from real Turing tests: at the Royal Society in London in 2014 and in UC San Diego studies from 2023, 2024 and 2025. In each round the judge chatted with a human and with a program. Find the human, then see what the real judge decided.',
        )}</p>
        <p class="tt-facts">${t(`${ROUNDS.length} раундов · ${Object.keys(SRC).length} исследования · около 5 минут`, `${ROUNDS.length} rounds · ${Object.keys(SRC).length} studies · about 5 minutes`)}</p>
        <details class="tt-more">
          <summary>${t('Откуда эти записи', 'Where these transcripts come from')}</summary>
          <ul class="tt-sources">${Object.values(SRC).map((x) => `<li><a href="${x.url}" target="_blank" rel="noopener">${x.cite}</a></li>`).join('')}</ul>
          <p class="tt-note">${t(
            'Статьи опубликованы под лицензией CC BY 4.0. Перевод на русский сделан для этого музея; опечатки оригинала по возможности сохранены, пояснения переводчика — в квадратных скобках.',
            'The papers are published under the CC BY 4.0 license. Original spelling and typos are kept.',
          )}</p>
        </details>
        <button type="button" class="guess-next" id="turingStart">${t('Пройти тест →', 'Take the test →')}</button>
      </div>`;
    document.getElementById('turingStart').addEventListener('click', start);
  }

  function start() {
    game = { n: 0, score: 0, marks: [], order: order() };
    round();
  }
  if (location.hash === '#start') start();
  else intro();
})();
