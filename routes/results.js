const express = require('express');
const router  = express.Router();
const { getResults, getTotalResults } = require('../db/helper/polls')

module.exports = (db) => {
  router.get("/:id", (req, res) => {  // get all results for poll id = poll_id
    getTotalResults(db, req.params.id)
    .then((data) => {
      const templateVar = data
      // console.log(templateVar)
      res.render('totalResults', templateVar)
      return;
    })

  })

  router.get("/i/:id", (req, res) => {  // get results for poll from specific user :id = submission_id
    getResults(db, req.params.id)
    .then((data) => {
      console.log('results.js data : ', data)
      const templateVar = {results: data}
      console.log(templateVar)
      res.render('results', templateVar)
      return;
    })

  })

  return router;
}
