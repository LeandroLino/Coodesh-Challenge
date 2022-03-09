const express = require("express");
const bodyParse = require("body-parser");
const cron = require("node-cron");

const app = express();
const request = require("request");

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));

const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("./api.schema.json");

app.use("/doc", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.get("/", async (req, res) => {
  res.send("Back-end Challenge 2021 🏅 - Space Flight News");
});

require("./controlles/authControlles")(app);

function SendMailDaily() {
  console.log("Teste Cron");
}
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at https://localhost:3000");
});
cron.schedule("0 11 * * *", SendMailDaily);
