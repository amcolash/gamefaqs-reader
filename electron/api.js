import fetch from 'electron-fetch';
import { JSDOM } from 'jsdom';

import { cookieKey, guideCache, store } from './store';

const CACHE = {};

export async function getGames(search) {
  const url = `https://gamefaqs.gamespot.com/search?game=${search}`;

  try {
    const data = await checkCache(url);

    const dom = new JSDOM(data);
    const results = Array.from(dom.window.document.querySelectorAll('.search_result'));

    const games = [];
    results.forEach((r) => {
      const title = r.querySelector('.sr_name').textContent.trim();
      const [genre, year] = r.querySelector('.sr_info').textContent.split(', ');
      const platforms = r.querySelector('.meta.float_r').textContent.split(', ');
      const url = 'https://gamefaqs.gamespot.com' + r.querySelector('.log_search').getAttribute('href');
      const id = url.split('/').pop();

      const parsedYear = Number.parseInt(year);

      const game = { title, genre, year: isNaN(parsedYear) ? year : parsedYear, platforms, url, id };
      games.push(game);
    });

    return { data: games };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}

export async function getGuides(id) {
  // Not sure if it should always be hardcoded to "pc", seems like it resolves ok?
  const url = `https://gamefaqs.gamespot.com/pc/${id}/faqs`;

  try {
    const data = await checkCache(url);
    const dom = new JSDOM(data);

    const results = Array.from(dom.window.document.querySelectorAll('.gf_guides li'));

    const guides = [];
    if (results.length > 0) {
      const gameId = id;
      const gameTitle = dom.window.document
        .querySelector('.page-title')
        .textContent.replace(' – Guides and FAQs', '')
        .trim();

      results.forEach((r) => {
        const platform = r.getAttribute('data-platform');
        const comment = r.querySelector('.meta.float_l')?.textContent.replace(/\s+/g, ' ').trim();

        const info = r.querySelector('.float_l:first-child');
        const title = info.querySelector('a.bold').textContent;
        const url = info.querySelector('a.bold').getAttribute('href');
        const id = url.split('/').pop();
        const authors = Array.from(info.querySelectorAll('a:not(.bold)')).map((a) => a.textContent);
        const html = info.querySelector('.flair')?.textContent?.includes('HTML');

        const meta = r.querySelector('.meta.float_r');
        const [version, size, year] = meta.textContent.trim().split(', ');

        const parsedYear = Number.parseInt(year);

        const guide = {
          platform,
          comment,
          title,
          url,
          id,
          authors,
          version,
          size,
          year: isNaN(parsedYear) ? year : parsedYear,
          gameId,
          gameTitle,
          html,
        };
        guides.push(guide);
      });
    }

    return { data: guides };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}

export async function getGuide(gameId, guideId) {
  const url = `https://gamefaqs.gamespot.com/pc/${gameId}/faqs/${guideId}`;

  try {
    const data = await checkCache(url, true);
    const dom = new JSDOM(data);
    const sections = Array.from(dom.window.document.querySelectorAll('.faqtext pre'));
    const guide = sections.map((s) => s.textContent).join('\n');

    return { data: guide };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}

export async function getHTMLGuide(gameId, guideId, guidePage) {
  const url = `https://gamefaqs.gamespot.com/pc/${gameId}/faqs/${guideId}`;

  try {
    const data = await checkCache(url);
    const dom = new JSDOM(data);

    let htmlGuide = dom.window.document.querySelector('#faqwrap')?.innerHTML || '';
    htmlGuide = htmlGuide.replaceAll(/\/a\/faqs\//g, 'https://gamefaqs.gamespot.com/a/faqs/');

    htmlGuide = htmlGuide.replace(/<a id=".+?"><\/a>/g, '');

    htmlGuide = htmlGuide.replace(/<a/g, '<button onclick="window.setGuidePage(this.getAttribute(\'href\'))"');
    htmlGuide = htmlGuide.replace(/<\/a>/g, '</button>');

    return { data: htmlGuide };
  } catch (err) {
    console.error(err);
    return { error: err };
  }
}

export function removeGuide(gameId, guideId) {
  const url = `https://gamefaqs.gamespot.com/pc/${gameId}/faqs/${guideId}`;

  console.log(`Removing guide from cache ${url}`);
  guideCache.remove(url);
}

async function checkCache(url, isGuide) {
  if (CACHE[url]) {
    console.log(`Using cache for ${url}`);
    return CACHE[url];
  }

  if (guideCache.has(url)) {
    console.log(`Using guide cache for ${url}`);
    return guideCache.get(url).data;
  }

  console.log(`Fetching ${url}`);
  const cookie = store.get(cookieKey);
  const data = await fetch(url, { headers: { cookie: `gf_dvi=${cookie.value}`, 'User-Agent': '' } }).then((res) =>
    res.text()
  );

  if (isGuide) guideCache.set(url, { date: Date.now(), data: data });
  else CACHE[url] = data;

  return data;
}
