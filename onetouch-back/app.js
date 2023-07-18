const express = require("express");
const app = express();
const port = 4000;
const routes = require("./routes");
const cors = require('cors')
app.use(express.json());
app.use(cors());

app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
