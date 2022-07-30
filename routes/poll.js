const express = require('express');
const router  = express.Router();


module.exports = (db) => {
  router.get("/:id", (req, res) => {
    res.send('OK')
  })



  router.post("/:id", (req, res) => {
    res.send('OK')
  })


  return router;
}
