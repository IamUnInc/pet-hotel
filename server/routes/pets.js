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

    client.query('SELECT pets.id, pets.pet_name, pets.pet_breed, pets.pet_color, owners.first_name, owners.last_name FROM pets JOIN owners ON pets.owners_id = owners.id', function (err, result) {
      done(); //closes connection

      if (err) {
        res.sendStatus(500);
      }

      res.send(result.rows);
    });
  });
});

router.post('/', function (req, res) {
  var pet = req.body;
  console.log("pet", pet);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('INSERT INTO pets (pet_name, pet_breed, pet_color, owners_id)'
                + 'VALUES ($1, $2, $3, $4)',
                [pet.pet_name, pet.pet_breed, pet.pet_color, pet.owner],
                function (err, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                  }

                  res.sendStatus(201);
                });
  });
});

router.delete('/:id', function (req, res) {
  var id = (req.params.id);
  console.log("id", id);

  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('DELETE FROM pets ' +
                'WHERE id = $1',
                [id],
                function (error, result) {
                  done();

                  if (err) {
                    res.sendStatus(500);
                    return;
                  }

                  res.sendStatus(200);
                });
  });
});

router.put('/:id', function(req, res){
  var id = req.params.id;
  var pet = req.body;
  console.log("id:", id);
  console.log("pet:", pet);

    pg.connect(connectionString, function(err, client, done) {
    if (err) {
      res.sendStatus(500);
    }

    client.query('UPDATE pets' +
                ' SET pet_name = $1, ' +
                ' pet_breed = $2,' +
                ' pet_color = $3' +
                ' WHERE id = $4',
              [pet.pet_name, pet.pet_breed, pet.pet_color, id],
            function (err, result){
              done();
              if (err) {
                console.log('err', err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
  });
});


module.exports = router;
