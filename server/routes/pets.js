var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/omicron';

router.get('/', function (req, res) {
  //Retrieve books from database
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('SELECT * FROM pets JOIN owners ON pets.owners_id = owners.id', function (err, result) {
      done(); //closes connection

      if (err) {
        res.sendStatus(500);
      }

      res.send(result.rows);
    });
  });
});

module.exports = router;
