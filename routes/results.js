const express = require('express');
const router  = express.Router();
const { getResults } = require('../db/helper/polls')

module.exports = (db) => {
  router.get("/", (req, res) => {  // get all results for poll
    res.send('OK')

  })

  router.get("/i/:id", (req, res) => {  // get results for poll from specific user

    getResults(db, req.params.id)
    .then((data) => {
      const templateVar = {results: data}
      res.render('results', templateVar)
    })

  })

  return router;
}
