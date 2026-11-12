(() => {
  const { t, en, store } = window.MU;
  const BOTS = window.MUSEUM_BOTS.filter((b) => !b.hidden && !b.aside && b.create);
  const ASKS_NAME = new Set(['sbaitso', 'racter']);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const asText = (r) => (Array.isArray(r) ? r.join(' ') : String(r ?? ''));

  function local(bot) {
    const e = bot.create();
    return e.keyed || e.closed ? null : e;
  }
  const PLAYERS = BOTS.filter((b) => local(b));

  function quiet(fn) {
    const set = store.set;
    store.set = () => {};
    try {
      return fn();
    } finally {
      store.set = set;
    }
  }

  // Разговор двух ботов
  const a = document.getElementById('duelA');
  const b = document.getElementById('duelB');
  const go = document.getElementById('duelGo');
  const log = document.getElementById('duelLog');
  const picker = document.getElementById('duelPick');
  const HALLS = [1984, 2008, 2019, 9999];
  const pick = [PLAYERS.findIndex((p) => p.id === 'eliza'), PLAYERS.findIndex((p) => p.id === 'parry')];

  function side(el, k) {
    const p = PLAYERS[pick[k]];
    el.className = `duel-side ${p.theme}`;
    el.innerHTML = `<span class="duel-av">${p.name[0]}</span>
      <b>${p.name}</b>
      <small>${p.year} · ${t('Зал', 'Hall')} ${HALLS.findIndex((y) => p.year <= y) + 1}</small>
      <span class="duel-author">${p.author}</span>
      <span class="duel-arrows">
        <button type="button" data-step="-1" aria-label="${t('Предыдущий бот', 'Previous bot')}">‹</button>
        <button type="button" data-step="1" aria-label="${t('Следующий бот', 'Next bot')}">›</button>
      </span>`;
  }
  function chips() {
    picker.innerHTML = [t('Первый', 'First'), t('Второй', 'Second')]
      .map((label, k) => `<span class="duel-pick-lab">${label}</span><div class="duel-pick-row">${PLAYERS.map((p, i) => `<button type="button" class="${pick[k] === i ? 'on' : ''}" data-k="${k}" data-i="${i}">${p.name}</button>`).join('')}</div>`)
      .join('');
  }
  function choose(k, i) {
    pick[k] = i;
    side([a, b][k], k);
    chips();
    run++;
    log.innerHTML = '';
    go.textContent = t('Начать разговор', 'Start the conversation');
  }
  [a, b].forEach((el, k) => {
    side(el, k);
    el.addEventListener('click', (e) => {
      const step = e.target.closest('[data-step]');
      if (step) choose(k, (pick[k] + Number(step.dataset.step) + PLAYERS.length) % PLAYERS.length);
    });
  });
  chips();
  picker.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-k]');
    if (!btn) return;
    const row = btn.parentElement;
    const left = row.scrollLeft;
    choose(Number(btn.dataset.k), Number(btn.dataset.i));
    picker.querySelectorAll('.duel-pick-row')[btn.dataset.k].scrollLeft = left;
  });
  let run = 0;

  function say(bot, text, k) {
    const el = document.createElement('div');
    const hall = HALLS.findIndex((y) => bot.year <= y);
    el.className = `duel-row${k ? ' right' : ''}`;
    el.innerHTML = `<span class="duel-a ${bot.theme}">${bot.name[0]}</span><div class="duel-msg hall-${hall} ${bot.theme}"><small class="duel-who">${bot.name} · ${bot.year}</small><span></span></div>`;
    el.querySelector('.duel-msg span').textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  }

  async function duel() {
    const id = ++run;
    log.innerHTML = '';
    go.textContent = t('Заново', 'Again');
    const pair = pick.map((i) => PLAYERS[i]);
    const engines = pair.map(local);
    let line = asText(engines[0].greet());
    say(pair[0], line, 0);
    for (let turn = 1; turn <= 12; turn++) {
      await sleep(1400);
      if (id !== run) return;
      const k = turn % 2;
      let reply;
      try {
        reply = asText(quiet(() => engines[k].reply(line)));
      } catch {
        reply = '...';
      }
      line = reply || '...';
      say(pair[k], line, k);
    }
  }
  go.addEventListener('click', duel);
})();
