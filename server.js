const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('MD ARAFAT KOYES - 13368229');
});

app.listen(HTTP_PORT, () => {
  console.log(`Server is running on port ${HTTP_PORT}`);
});

