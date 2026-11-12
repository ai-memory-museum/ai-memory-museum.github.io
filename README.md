# AI Memory

Интерактивный музей истории чат-ботов: линия времени от ELIZA (1966) до больших языковых моделей, с которыми можно поговорить прямо на странице. Статичный сайт без сборки: HTML, CSS и JavaScript, подключаемые тегами `<script>`.

An interactive museum of chatbot history: a timeline from ELIZA (1966) to large language models, each one ready to talk to on the page. A static site with no build step: plain HTML, CSS and JavaScript loaded with `<script>` tags.

## Что внутри · What is inside

- `index.html`, `app.js` — линия времени, карточка экспоната и окно разговора; `compare.js` — «один вопрос — всем»; `play.js` — разговор двух ботов.
- `detail.html`, `detail.js`, `stories/*.js`, `stories/en/*.js` — страницы «Подробнее»: история, фотографии, источники.
- `math.html`, `math.js` — математика ботов: правила, цепь Маркова, нейрон.
- `turing.html`, `turing.js`, `turing-data.js` — тест Тьюринга на настоящих переписках.
- `bots/*.js` — движки ботов; `bots/util.js` — общие утилиты, язык и хранилище; `bots/archive.js` — экспонаты архива, с которыми нельзя поговорить.
- `style.css`, `theme.js` — оформление, тёмная тема.

Два языка, RU и EN: переключатель в шапке, параметр `?lang=en` или ключ `museum-lang` в localStorage.

ChatGPT и Claude отвечают через API по ключу, который посетитель вводит сам. Ключ хранится только в localStorage его браузера и никуда не отправляется, кроме серверов OpenAI и Anthropic.

ChatGPT and Claude answer through their APIs with a key the visitor enters themselves. The key is stored only in the browser's localStorage and is sent nowhere except to the OpenAI and Anthropic servers.

## Запуск локально · Running locally

Нужен любой статичный сервер; пути относительные, сайт работает и из подкаталога.

Any static file server will do; all paths are relative, so the site also works from a subdirectory.

```sh
python3 serve.py          # http://127.0.0.1:8790, без кэша
PORT=9000 python3 serve.py
# или / or
python3 -m http.server 8080
```

## Источники и лицензии · Sources and licenses

- **ELIZA.** Сценарий DOCTOR от 6 марта 1965 года и алгоритм из статьи Вейценбаума 1966 года. Код и сценарий открыты наследниками под лицензией CC0; взяты из [github.com/anthay/ELIZA](https://github.com/anthay/ELIZA). Русская версия — перевод сценария, выполненный для этого музея.
  **ELIZA.** The DOCTOR script dated 6 March 1965 and the algorithm from Weizenbaum's 1966 paper. Code and script released by his heirs under CC0, taken from [github.com/anthay/ELIZA](https://github.com/anthay/ELIZA). The Russian version is a translation of the script made for this museum.
- **A.L.I.C.E.** Около 60 категорий из набора Free A.L.I.C.E. AIML (ALICE A.I. Foundation, версия 2011 года, лицензия GNU GPL) в переводе на русский; английская версия воссоздана по тому же набору.
  **A.L.I.C.E.** About 60 categories from the Free A.L.I.C.E. AIML set (ALICE A.I. Foundation, 2011 version, GNU GPL), translated into Russian; the English version is recreated after the same set.
- **Тест Тьюринга.** Переписки взяты из статей, опубликованных под лицензией CC BY 4.0; перевод на русский сделан для этого музея:
  **Turing test.** Transcripts come from papers published under the CC BY 4.0 license; the Russian translation was made for this museum:
  - K. Warwick, H. Shah. Passing the Turing Test Does Not Mean the End of Humanity. Cognitive Computation, 2016 — [PMC4867147](https://pmc.ncbi.nlm.nih.gov/articles/PMC4867147/)
  - C. R. Jones, B. K. Bergen. Does GPT-4 pass the Turing test? 2023 — [arXiv:2310.20216](https://arxiv.org/abs/2310.20216)
  - C. R. Jones, B. K. Bergen. People cannot distinguish GPT-4 from a human in a Turing test. 2024 — [arXiv:2405.08007](https://arxiv.org/abs/2405.08007)
  - C. R. Jones, B. K. Bergen. Large language models pass a standard three-party Turing test. PNAS, 2026 — [PMC13214042](https://pmc.ncbi.nlm.nih.gov/articles/PMC13214042/)
- **Фотографии** на страницах «Подробнее» загружаются с Wikimedia Commons; автор, лицензия и ссылка на страницу файла указаны в подписи к каждой фотографии (`stories/*.js`).
  **Photos** on the detail pages are loaded from Wikimedia Commons; the author, license and a link to the file page are given in each caption (`stories/*.js`).
- **Остальные боты** (PARRY, Racter, Jabberwacky, Dr. Sbaitso, SmarterChild, Cleverbot, Siri, Женя Густман, MegaHAL) — реконструкции по описаниям оригинальных программ; их фразы написаны для этого музея. Подробности — в поле «источник» на карточке каждого экспоната.
  **The other bots** (PARRY, Racter, Jabberwacky, Dr. Sbaitso, SmarterChild, Cleverbot, Siri, Eugene Goostman, MegaHAL) are reconstructions from descriptions of the original programs; their lines were written for this museum. Details are in the "source" field on each exhibit card.
- Погода для SmarterChild и Siri — [Open-Meteo](https://open-meteo.com). Шрифты — Google Fonts. Claude подключается через `@anthropic-ai/sdk` с jsDelivr.
  Weather for SmarterChild and Siri comes from [Open-Meteo](https://open-meteo.com). Fonts from Google Fonts. Claude is reached through `@anthropic-ai/sdk` from jsDelivr.
