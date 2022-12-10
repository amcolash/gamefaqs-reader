const cors = require('cors');
const express = require('express');
const { readdirSync } = require('fs');
const { join } = require('path');

const app = express();
const port = 7000;

app.use(cors());
app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
});

app.use('/guides', express.static('guides'));
app.get('/files', (req, res) => {
  const dir = join(__dirname, '/guides');
  const files = readdirSync(dir);

  res.send(files);
});
