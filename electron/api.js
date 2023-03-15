import fetch from 'electron-fetch';
import { JSDOM } from 'jsdom';

import { cookieKey, store } from './store';

const CACHE = {};
const cookie = store.get(cookieKey);

export function getGames(search) {
  const url = `https://gamefaqs.gamespot.com/search?game=${search}`;

  return checkCache(url)
    .then((data) => {
      console.log(data.length, data.includes('search_result'));

      const dom = new JSDOM(data);
      const results = Array.from(dom.window.document.querySelectorAll('.search_result'));

      const games = [];
      results.forEach((r) => {
        const title = r.querySelector('.sr_name').textContent.trim();
        const [genre, year] = r.querySelector('.sr_info').textContent.split(', ');
        const platforms = r.querySelector('.meta.float_r').textContent.split(', ');
        const url = 'https://gamefaqs.gamespot.com' + r.querySelector('.log_search').getAttribute('href');
        const id = url.split('/').pop();

        const game = { title, genre, year: Number.parseInt(year), platforms, url, id };
        games.push(game);
      });

      return { data: games };
    })
    .catch((err) => {
      console.error(err);
      return { error: err };
    });
}

export async function getGuides(id) {
  // Not sure if it should always be hardcoded to "pc", seems like it resolves ok?
  const url = `https://gamefaqs.gamespot.com/pc/${id}/faqs`;

  return checkCache(url)
    .then((data) => {
      const dom = new JSDOM(data);
      const mainGuideSection = dom.window.document.querySelector('.gf_guides');
      const results = Array.from(mainGuideSection.querySelectorAll('.gf_guides li'));

      const gameId = id;
      const gameTitle = dom.window.document.querySelector('.page-title').textContent.replace(' – Guides and FAQs', '').trim();

      const guides = [];
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

        const guide = { platform, comment, title, url, id, authors, version, size, year: Number.parseInt(year), gameId, gameTitle, html };
        guides.push(guide);
      });

      return { data: guides };
    })
    .catch((err) => {
      console.error(err);
      return { error: err };
    });
}

async function checkCache(url) {
  if (CACHE[url]) {
    console.log(`Using cache for ${url}`);
    return CACHE[url];
  }

  const data = await fetch(url, { headers: { cookie: `gf_dvi=${cookie.value}`, 'User-Agent': '' } }).then((res) => {
    console.log(res);
    return res.text();
  });
  CACHE[url] = data;

  return data;
}
