// Using axios since node-fetch doesn't seem to cooperate nicely
const axios = require('axios');

const cors = require('cors');
const express = require('express');
const { readdirSync } = require('fs');
const { JSDOM } = require('jsdom');
const { join, basename } = require('path');

require('dotenv').config();

const app = express();
const port = 7000;

const cookie = process.env.COOKIE;

const CACHE = {};

app.use(cors());
app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/games/:search', async (req, res) => {
  try {
    const url = `https://gamefaqs.gamespot.com/search?game=${req.params.search}`;
    const data = await checkCache(url);

    const dom = new JSDOM(data);
    const results = Array.from(dom.window.document.querySelectorAll('.search_result'));

    const games = [];
    results.forEach((r) => {
      const title = r.querySelector('.sr_name').textContent.trim();
      const [genre, year] = r.querySelector('.sr_info').textContent.split(', ');
      const platforms = r.querySelector('.meta.float_r').textContent.split(', ');
      const url = 'https://gamefaqs.gamespot.com' + r.querySelector('.log_search').getAttribute('href');
      const id = basename(url);

      const game = { title, genre, year: Number.parseInt(year), platforms, url, id };
      games.push(game);
    });

    res.send(games);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get('/guides/:id', async (req, res) => {
  try {
    const url = `https://gamefaqs.gamespot.com/pc/${req.params.id}/faqs`;
    const data = await checkCache(url);

    const dom = new JSDOM(data);
    const mainGuideSection = dom.window.document.querySelector('.gf_guides');
    const results = Array.from(mainGuideSection.querySelectorAll('.gf_guides li'));

    const guides = [];
    results.forEach((r) => {
      const platform = r.getAttribute('data-platform');
      const comment = r.querySelector('.meta.float_l')?.textContent.replace(/\s+/g, ' ').trim();

      const info = r.querySelector('.float_l:first-child');
      const title = info.querySelector('a.bold').textContent;
      const url = info.querySelector('a.bold').getAttribute('href');
      const id = basename(url);
      const authors = Array.from(info.querySelectorAll('a:not(.bold)')).map((a) => a.textContent);

      const meta = r.querySelector('.meta.float_r');
      const [version, size, year] = meta.textContent.trim().split(', ');

      const guide = { platform, comment, title, url, id, authors, version, size, year: Number.parseInt(year) };
      guides.push(guide);
    });

    res.send(guides);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get('/guide/:gameId/:guideId', async (req, res) => {
  try {
    const url = `https://gamefaqs.gamespot.com/pc/${req.params.gameId}/faqs/${req.params.guideId}`;
    const data = await checkCache(url);

    const dom = new JSDOM(data);
    const sections = Array.from(dom.window.document.querySelectorAll('.faqtext pre'));
    const guide = sections.map((s) => s.textContent).join('\n');

    res.send(guide);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

async function checkCache(url) {
  if (CACHE[url]) {
    console.log(`Using cache for ${url}`);
    return CACHE[url];
  }

  console.log(`Making request for ${url}`);

  const data = await axios.get(url, { headers: { cookie } }).then((res) => res.data);
  CACHE[url] = data;

  return data;
}
