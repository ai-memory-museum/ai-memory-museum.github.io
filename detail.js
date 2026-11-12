(() => {
  const { t, en } = window.MU;
  const BOTS = window.MU.localize(window.MUSEUM_BOTS).filter((b) => !b.hidden).sort((a, b) => a.year - b.year);
  BOTS.forEach((b) => (b.story = window.MU.story(b.id)));
  document.documentElement.lang = window.MU.lang;
  const langBtn = document.getElementById('langBtn');
  langBtn.textContent = en ? 'RU' : 'EN';
  langBtn.setAttribute('aria-label', en ? 'Переключить на русский' : 'Switch to English');
  langBtn.addEventListener('click', () => {
    window.MU.store.set('museum-lang', en ? 'ru' : 'en');
    history.replaceState(null, '', location.pathname + location.hash);
    location.reload();
  });
  const root = document.getElementById('story');
  const host = (u) => new URL(u).host.replace(/^www\./, '');

  function render() {
    const bot = BOTS.find((b) => b.id === location.hash.slice(1) && (b.story || b.aside)) || BOTS.find((b) => b.story);
    const story = bot.story || { sections: [], images: [], refs: [] };
    const refs = [...(story.refs || []), ...(bot.refs || [])];
    document.title = `${bot.name} — AI Memory`;
    root.innerHTML = `
      <a class="back" href="index.html#${bot.aside ? 'vitrina' : bot.id}">${bot.aside ? t('← к архиву музея', '← back to the museum archive') : t('← к линии и разговору', '← back to the timeline and chat')}</a>
      <div class="year">${bot.year}</div>
      <h2>${bot.name}</h2>
      <div class="who">${bot.author} · ${bot.place}</div>
      <p class="lead">${bot.lead}</p>
      ${story.images[0] ? figure(story.images[0]) : ''}
      ${story.sections
        .map((section, i) => `<section><h3>${section.title}</h3>${section.text.map((paragraph) => `<p>${paragraph}</p>`).join('')}</section>${story.images[i + 1] ? figure(story.images[i + 1]) : ''}`)
        .join('')}
      <section><h3>${t('Как это работало', 'How it worked')}</h3><p>${bot.how}</p></section>
      <section><h3>${t('Интересные факты', 'Interesting facts')}</h3><ul>${bot.facts.map((f) => `<li>${f}</li>`).join('')}</ul></section>
      <details class="sources"><summary>${t('Источники', 'Sources')} (${refs.length})</summary><ul class="refs">${refs
        .map((r) => `<li><a href="${r}" target="_blank" rel="noopener">${host(r)}</a></li>`)
        .join('')}</ul></details>
      ${bot.aside ? `<a class="talk" href="index.html#vitrina">${t('← ко всем экспонатам', '← to all exhibits')}</a>` : `<a class="talk" href="index.html#${bot.id}">${t('Поговорить с', 'Talk to')} ${bot.name} →</a>`}`;
    scrollTo(0, 0);
  }

  const figure = (image) => `
    <figure>
      <img src="${image.src}" alt="${image.caption}" loading="lazy">
      <figcaption>${image.caption} <span>${t('Фото:', 'Photo:')} <a href="${image.page}" target="_blank" rel="noopener">${image.credit}</a>, ${image.license}.</span></figcaption>
    </figure>`;

  window.addEventListener('hashchange', render);
  render();
})();
