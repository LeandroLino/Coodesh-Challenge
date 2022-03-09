const mongoose = require("mongoose");
//require("dotenv").config({ path: "../.env" });
require("dotenv").config();

console.log(process.env.DB_CONNECTION);

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
