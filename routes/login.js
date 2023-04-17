const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

function connect() {
  const connection = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to database: ' + err.stack);
      return;
    }

    console.log('Connected to database with connection ID ' + connection.threadId);
  });

  return connection;
}

router.get('/', (req, res) => {
  res.render('login', { title: 'User Login' });
});

router.post('/', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const connection = connect();

  const query = `SELECT * FROM users WHERE email = '${email}'`;

  connection.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }

        if (result) {
          // req.session.user = {
          //   id: user.id,
          //   name: user.name,
          //   email: user.email,
          // };
          req.session = user;
          console.log(req.session);
          res.redirect('/home');
        } else {
          res.locals.errorMessage = 'Invalid email or password';
          res.render('login', { title: 'User Login' });
        }
      });
    } else {
      res.locals.errorMessage = 'Invalid email or password';
      res.render('login', { title: 'User Login' });
    }
  });
  console.log(`Email: ${email}`);
console.log(`Password: ${password}`);


  connection.end();
});


module.exports = router;
