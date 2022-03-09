const express = require("express");

var request = require("request");

const Article = require("../models/Articles");
const router = express.Router();

const population = require("./population.js");

router.post("/population", async (req, res) => {
  try {
    await population();
    res.send({
      OK: "All in database",
    });
  } catch (err) {
    return res.send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    delete req.body.id;
    try {
      await Article.find(req.params.id, req.body);
    } catch {
      res.status(400).send({
        message: "Not Found",
        code: 404,
        error: "Not has possible find this article",
      });
    }
    const article = await Article.findOneAndUpdate(req.params.id, req.body, {
      new: true,
    }).select({ __v: 0 });
    res.send({ ...article._doc, ...req.body });
    article.save();
  } catch (err) {
    return res.send({ err });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.id) {
      const article = await Article.find({}, { _id: 0, __v: 0 });
      req.body.id = article.slice(-1)[0].id + 1;
    }
    const findResponse = await Article.findOne(req.params.id);
    if (!findResponse) {
      const article = await Article.create(req.body);
      res.status(201).send(article);
    } else {
      res.status(403).send({
        message: "Id in use",
        code: 403,
        error: "Has other article with this id",
      });
    }
  } catch (err) {
    return res.send({ a: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const article = await Article.findOneAndDelete(req.params.id);
    if (!article) {
      res.status(404).send({
        message: "Not found",
        code: 404,
        error: "Not has possible find this article",
      });
    }
    res.send({});
  } catch (err) {
    return res.send({ err });
  }
});

router.get("/:id?", async (req, res) => {
  try {
    if (req.params.id) {
      const article = await Article.findOne(
        { id: req.params.id },
        { _id: 0, __v: 0 }
      );
      if (!article) {
        res.status(404).send({
          message: "Not found",
          code: 404,
          error: "Not has possible find this article",
        });
      }
      res.send(article);
    }
    if (req.headers.limit && req.headers.start) {
      const { start, limit } = req.headers;
      const article = await Article.find({}, { _id: 0, __v: 0 });
      res.send(article.slice(start, limit));
    } else {
      res.status(400).send({
        message: "Need some parameter",
        code: 400,
        error: "It is necessary to pass some id or parameter",
      });
    }
  } catch (err) {
    return res.send({ error: err.name });
  }
});

module.exports = (app) => app.use("/articles", router);
