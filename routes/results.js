const express = require("express");
const router = express.Router();
const { getResults, getTotalResults } = require("../db/helper/polls");

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    // get all results for poll id = poll_id
    getTotalResults(db, req.params.id).then((data) => {
      const templateVar = { poll: data };
      console.log(templateVar);
      res.render("totalResults", templateVar);
    });
  });

  router.get("/i/:id", (req, res) => {
    // get results for poll from specific user :id = submission_id
    getResults(db, req.params.id).then((data) => {
      console.log(data);
      const templateVar = { results: data };
      res.render("results", templateVar);
      return;
    });
  });

  return router;
};
