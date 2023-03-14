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
      if (results.length === 0) throw 'Error searching - no results found';

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
