const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/home', routes.sample);

// running on localhost port 8080
app.listen(8080, () => {
  console.log(`Server running at http://localhost:8080/`)
});

module.exports = app;
