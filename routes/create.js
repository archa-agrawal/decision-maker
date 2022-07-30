const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.get("/", (req, res) => {
    res.render('create');

  })



  router.post("/", (req, res) => {
    res.send('OK');
  })


  return router;
}
