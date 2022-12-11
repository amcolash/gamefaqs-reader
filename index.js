// Using axios since node-fetch doesn't seem to cooperate nicely
const axios = require('axios');

const cors = require('cors');
const express = require('express');
const { existsSync, readFileSync } = require('fs');
const { JSDOM } = require('jsdom');
const { join, basename } = require('path');

require('dotenv').config();

const cookie = process.env.COOKIE;
const PORT = process.env.PORT || 8004;

const CACHE = {};
const app = express();

// HTTPS setup
const credentials = {};
if (existsSync('./.cert/RSA-privkey.pem')) credentials.key = readFileSync('./.cert/RSA-privkey.pem');
else if (existsSync('./.cert/privkey.pem')) credentials.key = readFileSync('./.cert/privkey.pem');

// Try to fix let's encrypt stuff based on this post
// https://community.letsencrypt.org/t/facebook-dev-error-curl-error-60-ssl-cacert/72782
if (existsSync('./.cert/RSA-fullchain.pem')) {
  credentials.cert = readFileSync('./.cert/RSA-fullchain.pem');
} else if (existsSync('./.cert/RSA-cert.pem')) {
  credentials.cert = readFileSync('./.cert/RSA-cert.pem');
} else if (existsSync('./.cert/cert.pem')) {
  credentials.cert = readFileSync('./.cert/cert.pem');
}

// Make the server
if (credentials.cert && credentials.key) {
  const server = require('https').createServer(credentials, app);
  server.listen(PORT, '0.0.0.0');
  console.log(`Server running on port ${PORT} (HTTPS)`);
} else {
  console.error("Couldn't find TLS certs, this server expects to run on HTTPS");
  process.exit(1);
}

app.use(cors());

app.use('/', express.static(join(__dirname, 'dist')));

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
    res.status(404).send([]);
  }
});

app.get('/guides/:id', async (req, res) => {
  try {
    // Not sure if it should always be hardcoded to "pc", seems like it resolves ok?
    const url = `https://gamefaqs.gamespot.com/pc/${req.params.id}/faqs`;
    const data = await checkCache(url);

    const dom = new JSDOM(data);
    const mainGuideSection = dom.window.document.querySelector('.gf_guides');
    const results = Array.from(mainGuideSection.querySelectorAll('.gf_guides li'));

    const gameId = req.params.id;
    const gameTitle = dom.window.document.querySelector('.page-title').textContent.replace(' – Guides and FAQs', '').trim();

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

      const guide = { platform, comment, title, url, id, authors, version, size, year: Number.parseInt(year), gameId, gameTitle };
      guides.push(guide);
    });

    res.send(guides);
  } catch (err) {
    console.log(err);
    res.status(404).send([]);
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
    res.status(404).send('');
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
