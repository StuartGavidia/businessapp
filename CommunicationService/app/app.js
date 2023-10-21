const express = require('express');

const app = express();

const PORT = 5103;
const HOST = '0.0.0.0';

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Running on http://${HOST}:${PORT}`);
});
