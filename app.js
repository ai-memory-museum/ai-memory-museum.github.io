(() => {
  const { t, en } = window.MU;
  const ALL = window.MU.localize(window.MUSEUM_BOTS);
  const BOTS = ALL.filter((b) => !b.hidden && !b.aside).sort((a, b) => a.year - b.year);
  const ASIDE = ALL.filter((b) => b.aside).sort((a, b) => a.year - b.year);
  ALL.forEach((b) => (b.story = window.MU.story(b.id)));

  const $ = (id) => document.getElementById(id);
  const track = $('track');
  const timeline = track.parentElement;
  const card = $('card');
  const screen = $('screen');
  const term = $('term');
  const chatHead = $('chatHead');
  const log = $('log');
  const chips = $('chips');
  const meters = $('meters');
  const form = $('form');
  const input = $('input');
  const voiceBtn = $('voiceBtn');
  const resetBtn = $('resetBtn');
  const chatTitle = $('chatTitle');
  const keyBtn = $('keyBtn');
  const micBtn = $('micBtn');
  const keybar = $('keybar');
  const keyInput = $('keyInput');
  const keyDel = $('keyDel');
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null;

  const ORIGIN = {
    original: t('Оригинальные правила · перевод', 'Original rules'),
    reconstruction: t('Реконструкция, не оригинал', 'Reconstruction, not the original'),
    live: t('Настоящая нейросеть', 'Real neural network'),
    algorithm: t('Настоящий алгоритм · свой словарь', 'Real algorithm · our own vocabulary'),
    closed: t('Не работает · только история', 'Shut down · history only'),
    elsewhere: t('Работает · но не на этом сайте', 'Still running · but not on this site'),
  };

  const sessions = new Map();
  let current = null;
  let typing = null;
  let voiceOn = window.MU.store.get('museum-voice', true);

  const asList = (r) => (Array.isArray(r) ? r : [r]);

  function session(bot) {
    if (!sessions.has(bot.id)) {
      const engine = bot.create ? bot.create() : { closed: true, greet: () => bot.offline };
      sessions.set(bot.id, {
        engine,
        messages: asList(engine.greet()).map((text) => ({ who: engine.closed ? 'sys' : 'bot', text })),
        queue: [],
        fresh: true,
      });
    }
    return sessions.get(bot.id);
  }

  const LANE = 24;
  let GAP = 12;
  const STUB = 110;
  const ERAS = [
    { to: 1984, name: t('Первые собеседники', 'The first talkers') },
    { to: 2008, name: t('Домашние компьютеры и интернет', 'Home computers and the internet') },
    { to: 2019, name: t('Помощники и соцсети', 'Assistants and social media') },
    { to: 9999, name: t('Большие языковые модели', 'Large language models') },
  ];
  let groups = [];

  function buildTimeline() {
    track.innerHTML = '<svg class="rails" aria-hidden="true"></svg><span class="soon">' + t('строится…', 'under construction…') + '</span>';
    groups = [];
    BOTS.forEach((b) => {
      const g = groups[groups.length - 1];
      if (g && g.year === b.year) g.bots.push(b);
      else groups.push({ year: b.year, bots: [b] });
    });
    groups.forEach((g) => {
      g.era = ERAS.findIndex((e) => g.year <= e.to);
      g.fork = g.bots.length > 1;
      g.sides = g.bots.map((_, i) => (g.fork ? (i % 2 ? 1 : -1) : 0));
      g.marks = g.bots.map((b, i) => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'mark' + (g.sides[i] > 0 ? ' below' : '');
        el.dataset.id = b.id;
        el.classList.add(b.theme);
        el.innerHTML = `<span class="dot"></span><span class="lbl"><b>${b.name}</b><i>${b.year}</i></span>`;
        el.addEventListener('click', () => go(b.id));
        track.appendChild(el);
        return el;
      });
    });
    ERAS.forEach((e, i) => {
      if (!groups.some((g) => g.era === i)) return;
      const el = document.createElement('span');
      el.className = 'era';
      el.dataset.era = i;
      el.textContent = e.name;
      track.appendChild(el);
    });
    layoutTimeline();
  }

  function place(allowBelow) {
    const end = { '-1': -Infinity, 1: -Infinity };
    let last = -Infinity;
    groups.forEach((g) => {
      const half = g.marks.map((m) => m.querySelector('.lbl').offsetWidth / 2);
      if (!g.fork) {
        const lo = Math.max(half[0], last + 26);
        const above = Math.max(lo, end[-1] + GAP + half[0]);
        const below = allowBelow ? Math.max(lo, end[1] + GAP + half[0]) : Infinity;
        g.below = below < above;
        g.marks[0].classList.toggle('below', g.below);
        g.x = Math.min(above, below);
        g.pos = [g.x];
        end[g.below ? 1 : -1] = g.x + half[0];
        last = g.x;
        return;
      }
      g.x = Math.max(last + 20, end[-1] + GAP - LANE, end[1] + GAP - LANE);
      g.pos = [];
      const cursor = { '-1': g.x + LANE + 8, 1: g.x + LANE + 8 };
      g.sides.forEach((side, i) => {
        const x = Math.max(cursor[side], end[side] + GAP + half[i]);
        g.pos[i] = x;
        end[side] = x + half[i];
        cursor[side] = x + 26;
      });
      last = g.x;
    });
    return Math.max(end[-1], end[1], last);
  }

  function layoutTimeline() {
    GAP = innerWidth <= 600 ? 34 : 12;
    const room = timeline.clientWidth - parseFloat(getComputedStyle(timeline).paddingLeft) * 2 - STUB;
    let natural = place(false);
    if (natural > room) natural = place(true);
    const extra = groups.length > 1 && natural < room ? (room - natural) / (groups.length - 1) : 0;
    const forks = groups.some((g) => g.fork);
    const top = forks ? LANE + 46 : 46;
    const bottom = (forks ? LANE + 46 : groups.some((g) => g.below) ? 46 : 16) + 18;
    groups.forEach((g, i) => {
      g.x += i * extra;
      g.pos = g.pos.map((p) => p + i * extra);
    });
    const line = (d, dash) => `<path d="${d}"${dash ? ' stroke-dasharray="4 6"' : ''}/>`;
    const last = groups[groups.length - 1];
    let svg = '';
    groups.forEach((g, i) => {
      const next = groups[i + 1];
      if (next) svg += line(`M${g.x} ${top} L${next.x} ${top}`);
      g.marks.forEach((m, k) => {
        m.style.left = g.pos[k] + 'px';
        m.style.top = top + g.sides[k] * LANE + 'px';
      });
      [-1, 1].forEach((side) => {
        const xs = g.pos.filter((_, k) => g.sides[k] === side);
        if (xs.length) svg += line(`M${g.x} ${top} L${g.x + LANE} ${top + side * LANE} L${Math.max(...xs)} ${top + side * LANE}`);
      });
    });
    svg += line(`M${last.x} ${top} L${last.x + 44} ${top}`, true);
    track.querySelector('.rails').innerHTML = svg;
    const soon = track.querySelector('.soon');
    soon.style.left = last.x + 52 + 'px';
    soon.style.top = top + 'px';
    const eraEls = [...track.querySelectorAll('.era')];
    const centers = eraEls.map((el) => {
      const xs = groups.filter((g) => g.era === +el.dataset.era).map((g) => g.x);
      el.textContent = ERAS[+el.dataset.era].name;
      el.title = '';
      el.style.left = (Math.min(...xs) + Math.max(...xs)) / 2 + 'px';
      el.style.top = top + bottom - 16 + 'px';
      return (Math.min(...xs) + Math.max(...xs)) / 2;
    });
    const tight = eraEls.some((el, k) => k && centers[k] - centers[k - 1] < (el.offsetWidth + eraEls[k - 1].offsetWidth) / 2 + 12) || eraEls[0].offsetWidth / 2 > centers[0];
    if (tight)
      eraEls.forEach((el) => {
        el.title = el.textContent;
        el.textContent = `${t('Зал', 'Hall')} ${+el.dataset.era + 1}`;
      });
    track.style.width = natural + (groups.length - 1) * extra + STUB + 'px';
    track.style.height = top + bottom + 'px';
    document.documentElement.style.setProperty('--top', $('top').offsetHeight + 'px');
    centre(false);
  }

  function centre(smooth) {
    const active = track.querySelector('.mark.active');
    if (!active) return;
    const left = timeline.scrollLeft + active.getBoundingClientRect().left - timeline.getBoundingClientRect().left - timeline.clientWidth / 2;
    timeline.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
  }

  function renderCard(bot) {
    const i = BOTS.indexOf(bot);
    const prev = BOTS[i - 1];
    const nextBot = BOTS[i + 1];
    const hall = ERAS.findIndex((e) => bot.year <= e.to);
    const num = String(i + 1).padStart(2, '0');
    card.className = 'card ' + bot.theme;
    card.innerHTML = `
      <div class="plaque-top"><span>${t('Экспонат №', 'Exhibit No.')} ${num} ${t('из', 'of')} ${BOTS.length}</span><span>${t('Зал', 'Hall')} ${hall + 1} · ${ERAS[hall].name}</span></div>
      <div class="titlerow"><h2>${bot.name}</h2><span class="year">${bot.year}</span></div>
      ${bot.when ? `<div class="when">${bot.when}</div>` : ''}
      <dl class="plaque">
        <div><dt>${t('Создатель', 'Creator')}</dt><dd>${bot.author}</dd></div>
        <div><dt>${t('Место', 'Place')}</dt><dd>${bot.place}</dd></div>
        <div><dt>${t('Платформа', 'Platform')}</dt><dd>${bot.ran || bot.machine}</dd></div>
        <div><dt>${t('Сейчас', 'Today')}</dt><dd>${bot.now || ''}</dd></div>
      </dl>
      <div class="origin o-${bot.origin}">${ORIGIN[bot.origin]}</div>
      <p class="source">${bot.source}</p>
      <p class="lead">${bot.lead}</p>
      <h3>${t('Как это работало', 'How it worked')}</h3>
      <p>${bot.how}</p>
      <h3>${t('Интересные факты', 'Interesting facts')}</h3>
      <ul>${bot.facts.map((f) => `<li>${f}</li>`).join('')}</ul>
      ${bot.story ? `<a class="more" href="detail.html#${bot.id}">${t('Подробнее: история, фото, люди →', 'More: history, photos, people →')}</a>` : ''}
      ${bot.status ? `<h3>${t('Сейчас', 'Today')}</h3><p>${bot.status}${bot.site ? ` ${t('Поговорить:', 'Talk to it:')} <a href="${bot.site}" target="_blank" rel="noopener">${new URL(bot.site).host}</a>` : ''}</p>` : ''}
      ${bot.refs ? `<h3>${t('Источники', 'Sources')}</h3><ul class="refs">${bot.refs.map((r) => `<li><a href="${r}" target="_blank" rel="noopener">${new URL(r).host.replace(/^www\./, '')}</a></li>`).join('')}</ul>` : ''}
      <div class="nav">
        ${prev ? `<button type="button" data-go="${prev.id}">← ${prev.name}, ${prev.year}</button>` : '<span></span>'}
        ${nextBot ? `<button type="button" data-go="${nextBot.id}">${nextBot.name}, ${nextBot.year} →</button>` : `<span class="soon-next">${t('Это конец линии — пока что', 'This is the end of the line — for now')}</span>`}
      </div>`;
    card.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
  }

  function renderMeters(s) {
    const list = s.engine.meters ? s.engine.meters() : [];
    meters.hidden = !list.length;
    meters.textContent = list
      .map((m) => {
        if (!m.max) return `${m.label.toUpperCase()}: ${m.value}`;
        const n = Math.round((m.value / m.max) * 10);
        return `${m.label.toUpperCase()} [${'█'.repeat(n)}${'░'.repeat(10 - n)}]`;
      })
      .join('   ');
  }

  function line(msg, bot) {
    const el = document.createElement('div');
    el.className = 'msg ' + msg.who;
    const who = document.createElement('span');
    who.className = 'who';
    who.textContent = msg.who === 'bot' ? bot.name.toUpperCase() + ':' : msg.who === 'sys' ? t('МУЗЕЙ:', 'MUSEUM:') : '>';
    const text = document.createElement('span');
    text.className = 'text';
    el.append(who, text);
    return { el, text };
  }

  function stopTyping() {
    if (typing) {
      clearInterval(typing.timer);
      typing.text.textContent = typing.full;
      typing.el.classList.remove('typing');
      typing = null;
    }
  }

  function speak(text, voice) {
    if (!voiceOn || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text.toLowerCase());
    u.lang = t('ru-RU', 'en-US');
    u.pitch = voice.pitch ?? 0.2;
    u.rate = voice.rate ?? 0.85;
    const all = speechSynthesis.getVoices();
    if (!all.length && !voice.waited) {
      let done = false;
      const again = () => {
        if (done) return;
        done = true;
        speak(text, { ...voice, waited: true });
      };
      speechSynthesis.addEventListener('voiceschanged', again, { once: true });
      setTimeout(again, 1000);
      return;
    }
    const lang = (x) => x.lang.replace('_', '-');
    const list = all.filter((x) => lang(x).startsWith(t('ru', 'en')));
    const named = (x, n) => x.name.startsWith(n) || x.voiceURI.includes('.' + n);
    const quality = (x) => (/premium/i.test(x.voiceURI) ? 2 : /enhanced/i.test(x.voiceURI) ? 1 : 0);
    const best = (xs) => xs.sort((p, q) => quality(q) - quality(p) || lang(q).startsWith(t('ru', 'en')) - lang(p).startsWith(t('ru', 'en')))[0];
    let v;
    for (const n of voice.names || []) if ((v = best(all.filter((x) => named(x, n))))) break;
    v = v || best(list.filter((x) => !(voice.avoid || []).some((n) => named(x, n)))) || list[0];
    if (v) {
      u.voice = v;
      if (!lang(v).startsWith(t('ru', 'en'))) {
        u.lang = v.lang;
        u.text = translit(u.text);
      }
    }
    speechSynthesis.speak(u);
  }

  const LAT = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'ye', ё: 'yo', ж: 'zh', з: 'z', и: 'ee', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'oo', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
  const translit = (s) => s.replace(/[а-яё]/g, (c) => LAT[c]);

  if ('speechSynthesis' in window) speechSynthesis.getVoices();

  function drain(bot, s) {
    if (sessions.get(bot.id) !== s) return;
    if (current !== bot || typing || !s.queue.length) {
      if (!s.queue.length && !s.waiting) input.disabled = !!s.engine.closed;
      return;
    }
    const msg = s.queue.shift();
    s.messages.push(msg);
    const { el, text } = line(msg, bot);
    log.appendChild(el);
    screen.scrollTop = screen.scrollHeight;
    if (msg.who === 'bot' && s.engine.voice) speak(msg.text, s.engine.voice === true ? {} : s.engine.voice);
    if (!bot.speed || msg.who === 'user') {
      text.textContent = msg.text;
      setTimeout(() => drain(bot, s), msg.who === 'user' ? 350 : 500);
      return;
    }
    let n = 0;
    el.classList.add('typing');
    typing = {
      el,
      text,
      full: msg.text,
      timer: setInterval(() => {
        n += 2;
        text.textContent = msg.text.slice(0, n);
        screen.scrollTop = screen.scrollHeight;
        if (n >= msg.text.length) {
          clearInterval(typing.timer);
          el.classList.remove('typing');
          typing = null;
          setTimeout(() => drain(bot, s), 450);
        }
      }, bot.speed * 2),
    };
  }

  function renderChat(bot) {
    const s = session(bot);
    const hall = ERAS.findIndex((e) => bot.year <= e.to);
    chatHead.innerHTML = `
      <span class="ch-kicker">${t('Экспонат', 'Exhibit')} ${String(BOTS.indexOf(bot) + 1).padStart(2, '0')} · ${t('Зал', 'Hall')} ${hall + 1} · ${ERAS[hall].name}</span>
      <h2 class="ch-name">${bot.name} <span class="ch-year">${bot.year}</span></h2>
      <dl class="ch-plaque">
        <div><dt>${t('Создатель', 'Creator')}</dt><dd>${bot.author}</dd></div>
        <div><dt>${t('Место', 'Place')}</dt><dd>${bot.place}</dd></div>
        <div><dt>${t('Платформа', 'Platform')}</dt><dd>${bot.ran || bot.machine}</dd></div>
        <div><dt>${t('Сейчас', 'Today')}</dt><dd>${bot.now || ''}</dd></div>
      </dl>
      <span class="seg"><button type="button" class="on" data-tab="chat">${t('Поговорить', 'Talk')}</button><button type="button" data-tab="info">${t('О боте', 'About')}</button></span>`;
    term.className = `term ${bot.theme} era-${ERAS.findIndex((e) => bot.year <= e.to)}`;
    chatHead.parentElement.classList.remove('show-info');
    fitName();
    $('termInfo').innerHTML = `
      <p>${bot.lead}</p>
      ${bot.facts.length ? `<h4>${t('Интересный факт', 'Interesting fact')}</h4><p>${bot.facts[0]}</p>` : ''}
      <button type="button" class="info-more" data-more>${t('Читать подробнее ↓', 'Read more ↓')}</button>
      <div class="info-rest" hidden>
        <div class="origin o-${bot.origin}">${ORIGIN[bot.origin]}</div>
        <p class="source">${bot.source}</p>
        <h4>${t('Как это работало', 'How it worked')}</h4>
        <p>${bot.how}</p>
        ${bot.facts.length > 1 ? `<h4>${t('Ещё факты', 'More facts')}</h4><ul>${bot.facts.slice(1).map((f) => `<li>${f}</li>`).join('')}</ul>` : ''}
        ${bot.status ? `<h4>${t('Сейчас', 'Today')}</h4><p>${bot.status}${bot.site ? ` ${t('Поговорить:', 'Talk to it:')} <a href="${bot.site}" target="_blank" rel="noopener">${new URL(bot.site).host}</a>` : ''}</p>` : ''}
        ${bot.refs ? `<h4>${t('Источники', 'Sources')}</h4><ul class="refs">${bot.refs.map((r) => `<li><a href="${r}" target="_blank" rel="noopener">${new URL(r).host.replace(/^www\./, '')}</a></li>`).join('')}</ul>` : ''}
        ${bot.story ? `<a class="info-more" href="detail.html#${bot.id}">${t('История, фото, люди →', 'History, photos, people →')}</a>` : ''}
      </div>`;
    log.innerHTML = '';
    const tag = bot.origin === 'reconstruction' ? t(' · реконструкция', ' · reconstruction') : bot.origin === 'closed' || bot.origin === 'elsewhere' ? t(' · архив', ' · archive') : '';
    chatTitle.innerHTML = '';
    const machine = document.createElement('span');
    machine.className = 'tb-machine';
    machine.textContent = bot.machine;
    const who = document.createElement('span');
    who.className = 'tb-who';
    who.textContent = bot.name.toLowerCase();
    who.append(Object.assign(document.createElement('span'), { className: 'tb-tag', textContent: tag }));
    chatTitle.append(machine, document.createTextNode(' '), Object.assign(document.createElement('span'), { className: 'tb-dash', textContent: '— ' }), who);
    voiceBtn.hidden = !s.engine.voice;
    voiceBtn.classList.toggle('on', voiceOn);
    keyBtn.hidden = !s.engine.keyed;
    keybar.hidden = true;
    micBtn.hidden = !(s.engine.listen && SR);
    if (rec) rec.stop();
    const shown = s.fresh ? [] : s.messages;
    shown.forEach((m) => {
      const { el, text } = line(m, bot);
      text.textContent = m.text;
      log.appendChild(el);
    });
    if (s.fresh) {
      s.queue = s.messages.splice(0).concat(s.queue);
      s.fresh = false;
    }
    chips.innerHTML = '';
    (bot.tries || []).forEach((t) => {
      const c = document.createElement('button');
      c.type = 'button';
      c.className = 'chip';
      c.textContent = t;
      c.addEventListener('click', () => send(t));
      chips.appendChild(c);
    });
    renderMeters(s);
    screen.scrollTop = screen.scrollHeight;
    input.disabled = !!s.engine.closed;
    input.placeholder = s.engine.closed ? t('здесь с ним поговорить нельзя', 'you cannot talk to this one here') : innerWidth <= 900 ? t('введите текст', 'type a message') : t('введите текст и нажмите Enter', 'type a message and press Enter');
    drain(bot, s);
  }

  async function send(text) {
    text = text.trim();
    if (!text || !current) return;
    const bot = current;
    const s = session(bot);
    if (s.engine.closed || typing || s.queue.length || s.waiting) return;
    input.value = '';
    input.disabled = true;
    s.waiting = true;
    s.queue.push({ who: 'user', text });
    drain(bot, s);
    const started = Date.now();
    let answer;
    try {
      answer = asList(await s.engine.reply(text));
    } catch {
      answer = ['...'];
    }
    await new Promise((r) => setTimeout(r, Math.max(0, 450 - (Date.now() - started))));
    s.waiting = false;
    s.queue.push(...answer.map((t) => ({ who: 'bot', text: t })));
    if (current === bot) renderMeters(s);
    drain(bot, s);
  }

  function go(id) {
    const bot = BOTS.find((b) => b.id === id) || BOTS[0];
    stopTyping();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (current) {
      const prev = session(current);
      prev.messages.push(...prev.queue);
      prev.queue = [];
    }
    current = bot;
    if (location.hash.slice(1) !== bot.id) history.replaceState(null, '', '#' + bot.id);
    track.querySelectorAll('.mark').forEach((m) => m.classList.toggle('active', m.dataset.id === bot.id));
    centre(true);
    renderCard(bot);
    renderChat(bot);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send(input.value);
    input.focus();
  });

  resetBtn.addEventListener('click', () => {
    if (!current) return;
    stopTyping();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    const s = sessions.get(current.id);
    if (s) s.queue = [];
    sessions.delete(current.id);
    renderChat(current);
  });

  screen.addEventListener('click', () => {
    if (!getSelection().toString()) input.focus();
  });

  const note = (text) => {
    const s = session(current);
    s.queue.push({ who: 'bot', text });
    drain(current, s);
  };

  keyBtn.addEventListener('click', () => {
    const k = current && session(current).engine.keyed;
    if (!k) return;
    keybar.hidden = !keybar.hidden;
    const saved = window.MU.store.get('museum-key-' + k.id, '');
    keyInput.value = '';
    keyInput.placeholder = saved ? t(`${k.label} сохранён — вставьте новый, чтобы заменить`, `${k.label} is saved — paste a new one to replace it`) : t(`вставьте ${k.label} (${k.hint}) с ${k.where}`, `paste your ${k.label} (${k.hint}) from ${k.where}`);
    keyDel.hidden = !saved;
    if (!keybar.hidden) keyInput.focus();
  });

  keybar.addEventListener('submit', (e) => {
    e.preventDefault();
    const k = session(current).engine.keyed;
    const v = keyInput.value.trim();
    if (!k || !v) return;
    window.MU.store.set('museum-key-' + k.id, v);
    keyInput.value = '';
    keybar.hidden = true;
    note(t('Ключ сохранён в этом браузере. Можно говорить.', 'The key is saved in this browser. You can talk now.'));
  });

  keyDel.addEventListener('click', () => {
    const k = session(current).engine.keyed;
    if (!k) return;
    window.MU.store.set('museum-key-' + k.id, '');
    keybar.hidden = true;
    note(t('Ключ удалён из этого браузера.', 'The key was removed from this browser.'));
  });

  micBtn.addEventListener('click', () => {
    if (rec) {
      rec.stop();
      return;
    }
    rec = new SR();
    rec.lang = t('ru-RU', 'en-US');
    rec.interimResults = false;
    micBtn.classList.add('on');
    rec.onresult = (e) => send(e.results[0][0].transcript);
    rec.onend = () => {
      rec = null;
      micBtn.classList.remove('on');
    };
    rec.start();
  });

  voiceBtn.addEventListener('click', () => {
    voiceOn = !voiceOn;
    window.MU.store.set('museum-voice', voiceOn);
    voiceBtn.classList.toggle('on', voiceOn);
    if (!voiceOn && 'speechSynthesis' in window) speechSynthesis.cancel();
  });

  window.addEventListener('hashchange', () => go(location.hash.slice(1)));
  function fitName() {
    const h = chatHead.querySelector('.ch-name');
    const k = chatHead.querySelector('.ch-kicker');
    h.style.fontSize = '';
    k.style.fontSize = '';
    if (innerWidth > 900) return;
    let f = 52;
    while (h.scrollWidth > h.clientWidth && f > 26) h.style.fontSize = `${(f -= 2)}px`;
    let g = 11;
    while (k.scrollWidth > k.clientWidth && g > 8) k.style.fontSize = `${(g -= 0.5)}px`;
  }
  addEventListener('resize', fitName);

  chatHead.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (!tab) return;
    chatHead.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b === tab));
    chatHead.parentElement.classList.toggle('show-info', tab.dataset.tab === 'info');
  });
  $('termInfo').addEventListener('click', (e) => {
    const more = e.target.closest('[data-more]');
    if (!more) return;
    more.nextElementSibling.hidden = false;
    more.remove();
  });

  let resizing = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizing);
    resizing = requestAnimationFrame(layoutTimeline);
  });
  if (document.fonts) document.fonts.ready.then(layoutTimeline);

  function renderAside() {
    $('asideList').innerHTML = ASIDE.map((b) => {
      const st = b.story;
      const img = st && st.images[0];
      return `
        <a class="shelf-item" href="detail.html#${b.id}">
          ${img ? `<img src="${img.src}" alt="${img.caption}" loading="lazy">` : `<span class="shelf-blank">${b.year}</span>`}
          <span class="shelf-year">${b.year}</span>
          <b>${b.name}</b>
          <span class="shelf-lead">${b.lead.split('. ')[0].replace(/\.$/, '')}.</span>
          <span class="shelf-more">${st ? t('Читать историю →', 'Read the story →') : t('Подробнее →', 'More →')}</span>
        </a>`;
    }).join('');
  }

  document.documentElement.lang = window.MU.lang;
  document.querySelectorAll('[data-en]').forEach((el) => {
    if (en) el.textContent = el.dataset.en;
  });
  document.querySelectorAll('[data-en-label]').forEach((el) => {
    if (en) el.setAttribute('aria-label', el.dataset.enLabel);
  });
  const langBtn = $('langBtn');
  langBtn.textContent = en ? 'RU' : 'EN';
  langBtn.setAttribute('aria-label', en ? 'Переключить на русский' : 'Switch to English');
  langBtn.addEventListener('click', () => {
    window.MU.store.set('museum-lang', en ? 'ru' : 'en');
    history.replaceState(null, '', location.pathname + location.hash);
    location.reload();
  });

  buildTimeline();
  renderAside();
  const start = location.hash.slice(1);
  go(start);
  const section = start && !BOTS.some((b) => b.id === start) && $(start);
  if (section) section.scrollIntoView();
})();
