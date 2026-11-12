(() => {
  const { t, en, store } = window.MU;
  const ASKS_NAME = new Set(['sbaitso', 'racter']);
  const TRIES = en
    ? ['Who are you?', 'Can you think?', 'Do you have feelings?', 'What is the meaning of life?']
    : ['Кто ты?', 'Ты умеешь думать?', 'У тебя есть чувства?', 'В чём смысл жизни?'];
  const HALLS = [1984, 2008, 2019, 9999];

  const form = document.getElementById('compareForm');
  const input = document.getElementById('compareInput');
  const grid = document.getElementById('compareGrid');
  const tries = document.getElementById('compareTries');
  if (en) input.placeholder = 'For example: who are you?';

  const asText = (r) => (Array.isArray(r) ? r.join(' ') : String(r ?? ''));
  const engines = new Map();

  function engine(bot) {
    if (!engines.has(bot.id)) {
      const created = bot.create ? bot.create() : { closed: true };
      if (ASKS_NAME.has(bot.id)) created.reply(t('Меня зовут Гость', 'My name is Guest'));
      engines.set(bot.id, created);
    }
    return engines.get(bot.id);
  }

  const talks = (eng) => !eng.closed && !(eng.keyed && !store.get('museum-key-' + eng.keyed.id, ''));
  const BOTS = window.MUSEUM_BOTS.filter((b) => !b.hidden && !b.aside && talks(engine(b)));

  function cards() {
    grid.innerHTML = BOTS.map((b) => {
      const hall = HALLS.findIndex((y) => b.year <= y);
      return `<article class="cmp-row hall-${hall} ${b.theme}" data-id="${b.id}">
        <span class="cmp-year">${b.year}</span>
        <span class="cmp-dot"></span>
        <div class="cmp"><b>${b.name}</b><p class="cmp-text"></p></div>
      </article>`;
    }).join('');
  }

  async function ask(q) {
    q = q.trim();
    if (!q) return;
    input.value = q;
    form.querySelector('button').disabled = true;
    await Promise.all(
      BOTS.map(async (b) => {
        const box = grid.querySelector(`[data-id="${b.id}"] .cmp-text`);
        box.className = 'cmp-text';
        box.classList.add('cmp-wait');
        box.textContent = '…';
        let answer;
        try {
          answer = asText(await engine(b).reply(q));
        } catch {
          answer = '...';
        }
        await new Promise((r) => setTimeout(r, 200 + Math.random() * 500));
        box.classList.remove('cmp-wait');
        box.textContent = answer;
      }),
    );
    form.querySelector('button').disabled = false;
  }

  tries.innerHTML = TRIES.map((q) => `<button type="button" class="chip">${q}</button>`).join('');
  tries.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip) ask(chip.textContent);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ask(input.value);
  });
  cards();
})();
