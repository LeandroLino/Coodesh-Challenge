const express = require("express");
const bodyParse = require("body-parser");
const cron = require("node-cron");
const population = require("./controlles/population.js");

const app = express();

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }));

const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("./api.schema.json");

app.use("/doc", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.get("/", async (req, res) => {
  res.send("Back-end Challenge 2021 🏅 - Space Flight News");
});

require("./controlles/authControlles")(app);

async function SendMailDaily() {
  console.log("entrou", new Date().getMinutes(), new Date().getHours());
  if (new Date().getHours() == "13" && new Date().getMinutes() == "25") {
    await population();
  }
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at :3000");
});
cron.schedule("* * * * *", SendMailDaily);
