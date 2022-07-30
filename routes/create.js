const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.get("/", (req, res) => {  // View page to create a new poll
    res.render('create');

  })



  router.post("/", (req, res) => { // Submit to create new poll
    res.send('OK');
  })


  return router;
}
