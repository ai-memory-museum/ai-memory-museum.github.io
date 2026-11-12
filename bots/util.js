window.MUSEUM_BOTS = [];
window.MUSEUM_STORIES = {};
window.MUSEUM_STORIES_EN = {};

window.MU = (() => {
  const lang = (() => {
    try {
      const q = typeof location !== 'undefined' && new URLSearchParams(location.search).get('lang');
      if (q === 'en' || q === 'ru') localStorage.setItem('museum-lang', JSON.stringify(q));
      return JSON.parse(localStorage.getItem('museum-lang')) === 'en' ? 'en' : 'ru';
    } catch {
      return 'ru';
    }
  })();
  const en = lang === 'en';
  const t = (ru, eng) => (en ? eng : ru);

  const norm = (s) =>
    ' ' +
    s
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[^a-zа-я0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() +
    ' ';

  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  const REFLECT = {
    я: 'вы', меня: 'вас', мне: 'вам', мной: 'вами',
    мой: 'ваш', моя: 'ваша', мое: 'ваше', мои: 'ваши',
    моего: 'вашего', моей: 'вашей', моих: 'ваших', моему: 'вашему', мою: 'вашу',
    ты: 'я', тебя: 'меня', тебе: 'мне', тобой: 'мной',
    твой: 'мой', твоя: 'моя', твое: 'мое', твои: 'мои',
    вы: 'я', вас: 'меня', вам: 'мне', вами: 'мной',
    ваш: 'мой', ваша: 'моя', ваше: 'мое', ваши: 'мои',
  };

  const REFLECT_EN = {
    i: 'you', me: 'you', my: 'your', mine: 'yours', myself: 'yourself', am: 'are', "i'm": "you're",
    you: 'I', your: 'my', yours: 'mine', yourself: 'myself', "you're": "I'm", are: 'am',
  };

  const reflect = (s) =>
    s
      .trim()
      .split(/\s+/)
      .map((w) => (en ? REFLECT_EN[w] : REFLECT[w]) ?? w)
      .join(' ');

  const cycler = () => {
    const idx = new Map();
    return (key, arr) => {
      const i = idx.get(key) ?? 0;
      idx.set(key, i + 1);
      return arr[i % arr.length];
    };
  };

  const fill = (tpl, m) => tpl.replace(/\$(\d)/g, (_, n) => reflect(m[n] || ''));

  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem(k);
        return v ? JSON.parse(v) : d;
      } catch {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch {}
    },
  };

  const parseName = (raw) => {
    const m = raw.match(en ? /(?:name is|i am|i'm|call me|this is)\s+([A-Za-z-]+)/i : /(?:^|\s)(?:зовут|я|это)\s+([A-Za-zА-Яа-яЁё-]+)/i);
    return ((m ? m[1] : raw.trim().split(/\s+/).pop()) || '').replace(/[^A-Za-zА-Яа-яЁё-]/g, '');
  };

  const WEATHER = {
    0: 'ясно', 1: 'почти ясно', 2: 'переменная облачность', 3: 'пасмурно', 45: 'туман', 48: 'туман с изморозью',
    51: 'морось', 53: 'морось', 55: 'сильная морось', 61: 'небольшой дождь', 63: 'дождь', 65: 'ливень',
    66: 'ледяной дождь', 67: 'ледяной дождь', 71: 'небольшой снег', 73: 'снег', 75: 'снегопад', 77: 'снежная крупа',
    80: 'ливни', 81: 'ливни', 82: 'сильные ливни', 85: 'снегопад', 86: 'сильный снегопад', 95: 'гроза', 96: 'гроза с градом', 99: 'гроза с градом',
  };


  const WEATHER_EN = {
    0: 'clear sky', 1: 'mainly clear', 2: 'partly cloudy', 3: 'overcast', 45: 'fog', 48: 'rime fog',
    51: 'drizzle', 53: 'drizzle', 55: 'heavy drizzle', 61: 'light rain', 63: 'rain', 65: 'heavy rain',
    66: 'freezing rain', 67: 'freezing rain', 71: 'light snow', 73: 'snow', 75: 'heavy snow', 77: 'snow grains',
    80: 'showers', 81: 'showers', 82: 'heavy showers', 85: 'snow showers', 86: 'heavy snow showers', 95: 'thunderstorm', 96: 'thunderstorm with hail', 99: 'thunderstorm with hail',
  };

  const cityVariants = (w) => {
    const out = [w];
    if (en) return out;
    if (w.endsWith('е')) out.push(w.slice(0, -1) + 'а', w.slice(0, -1));
    if (w.endsWith('и')) out.push(w.slice(0, -1) + 'ь', w.slice(0, -1) + 'я');
    return [...new Set(out)];
  };

  async function place(city) {
    const variants = cityVariants(city.toLowerCase());
    let fallback = null;
    for (const name of variants) {
      const g = await fetch(`https://geocoding-api.open-meteo.com/v1/search?count=10&language=${lang}&name=${encodeURIComponent(name)}`).then((r) => r.json());
      const list = g.results || [];
      const exact = list.filter((x) => variants.includes(x.name.toLowerCase())).sort((a, b) => (b.population || 0) - (a.population || 0));
      if (exact.length) return exact[0];
      fallback = fallback || list[0];
    }
    return fallback;
  }

  async function weather(city) {
    try {
      const p = await place(city);
      if (!p) return t(`Не нашёл город «${city}». Попробуй написать по-другому.`, `Couldn't find the city "${city}". Try spelling it differently.`);
      const w = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${p.latitude}&longitude=${p.longitude}&current=temperature_2m,weather_code,wind_speed_10m&wind_speed_unit=ms`
      ).then((r) => r.json());
      const c = w.current;
      const temp = Math.round(c.temperature_2m);
      const where = `${p.name}${p.country ? ', ' + p.country : ''}`;
      const deg = `${temp > 0 ? '+' : ''}${temp}°C`;
      const wind = Math.round(c.wind_speed_10m);
      return en
        ? `${where}: now ${deg}, ${WEATHER_EN[c.weather_code] || 'strange weather'}, wind ${wind} m/s.`
        : `${where}: сейчас ${deg}, ${WEATHER[c.weather_code] || 'погода непонятная'}, ветер ${wind} м/с.`;
    } catch {
      return t('Сервер погоды не отвечает. Нужен интернет. :(', 'The weather server is not answering. You need the internet. :(');
    }
  }


  const calc = (raw) => {
    const expr = raw
      .trim()
      .replace(/^(посчитай|сколько будет|вычисли|calculate|compute|what is|what's|how much is)\s*/i, '')
      .replace(/[=?]\s*$/, '')
      .replace(/,/g, '.')
      .replace(/[x×]/g, '*')
      .replace(/:/g, '/');
    if (!/^[\d\s+\-*/().^]+$/.test(expr) || !/\d\s*[+\-*/^]\s*[\d(]/.test(expr)) return null;
    try {
      const v = Function(`"use strict";return (${expr.replace(/\^/g, '**')})`)();
      if (Number.isFinite(v)) return `${expr.trim()} = ${Math.round(v * 1e8) / 1e8}`;
    } catch {}
    return t('Что-то не так с примером. Проверь скобки.', 'Something is wrong with that sum. Check the brackets.');
  };

  const localize = (bots) => {
    if (en) bots.forEach((b) => b.en && Object.assign(b, b.en));
    return bots;
  };

  const story = (id) => {
    const ru = window.MUSEUM_STORIES[id];
    const tr = window.MUSEUM_STORIES_EN[id];
    if (!ru || !en || !tr) return ru;
    const EN_WORDS = [['общественное достояние', 'public domain'], ['возможно, ', 'possibly '], ['Европейская комиссия', 'European Commission']];
    const tx = (v) => EN_WORDS.reduce((acc, [r, e]) => acc.replace(r, e), v);
    return {
      ...ru,
      sections: tr.sections,
      images: ru.images.map((im, i) => ({ ...im, caption: (tr.captions || [])[i] || im.caption, credit: tx(im.credit), license: tx(im.license) })),
    };
  };

  return { lang, en, t, localize, story, norm, pick, reflect, cycler, fill, store, parseName, weather, calc };
})();

