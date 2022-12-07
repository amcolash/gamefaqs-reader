const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 7000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get('/search/:query', async (req, res) => {
  const url = `https://gamefaqs.gamespot.com/search?game=${req.params.query}`;
  console.log(url);

  const data = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36' },
  }).then((res) => res.text());

  res.send(data);
});
