import router from './routes/index';

const express = require('express');

const server = express();
const port = process.env.PORT || 5000;

router(server);

server.listen(port, () => {
  console.log(`Server liestening at https://localhost:${port}/`);
});
