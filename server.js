<<<<<<< HEAD
const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object
const HTTP_PORT = process.env.PORT || 3000; // assign a port

// get index Route
app.get('/', (req, res) => {
  res.send("Hello world");
});

// get contact Route
app.get('/contact', (req, res) => {
  res.send("Hello world");
});

// get about Route
app.get('/about', (req, res) => {
  res.send("Hello world");
});

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
=======
const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('MD ARAFAT KOYES - 123456789');
});

app.listen(HTTP_PORT, () => {
  console.log(`Server is running on port ${HTTP_PORT}`);
});
>>>>>>> 88797b9ad9bcd0ed49bff9f511612944e7206902
