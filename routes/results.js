const express = require("express");
const router = express.Router();
const { getResults, getTotalResults } = require("../db/helper/submissions");

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    // get all results for poll id = poll_id
    getTotalResults(db, req.params.id)
      .then((data) => {
        const templateVar = { poll: data };
        res.render("totalResults", templateVar);
      })
      .catch(() => {
        res.redirect("/error");
      });
  });

  router.get("/i/:id", (req, res) => {
    // get results for poll from specific user :id = submission_id
    getResults(db, req.params.id)
      .then((data) => {
        const templateVar = { results: data };
        res.render("results", templateVar);
        return;
      })
      .catch(() => {
        res.redirect("/error");
      });
  });

  return router;
};
