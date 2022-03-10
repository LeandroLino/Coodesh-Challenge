const express = require("express");

var request = require("request");

const Article = require("../models/Articles");

module.exports = async (req, res) => {
  try {
    console.log("FUNÇÃO");
    const response = await Article.find({}).select("id");
    const currentId = Object.values(response).map((value) => value.id);
    console.log("REQ");
    await request(
      `https://api.spaceflightnewsapi.net/v3/articles?_limit=99999999&_start=0`,
      async (_, __, body) => {
        console.log("BODY");
        if (body !== "Not Found") {
          JSON.parse(body).map(async (value) => {
            if (!currentId.includes(value.id)) {
              await Article.create(value);
            } else {
              const updated = await Article.findOneAndUpdate(value.id, value);
              updated.save();
            }
          });
          return;
        }
      }
    );
  } catch (err) {
    return res.send(err);
  }
};
