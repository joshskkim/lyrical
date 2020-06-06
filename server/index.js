/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
const app = require('./server');

const port = 9010;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
