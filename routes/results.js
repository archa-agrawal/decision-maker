const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.get("/", (req, res) => {  // get all results for poll
    res.send('OK')

  })

  router.get("/", (req, res) => {  // get results for poll from specific user
    res.send('OK')

  })

  return router;
}
