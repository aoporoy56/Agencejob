const express = require('express');
const router = new express.Router();
const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const saltRounds = 10;

dotenv.config();

class Registration {
  constructor(name, email, password, confirmPassword) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.confirmPassword = confirmPassword;
  }
}

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
  res.render('login', { title: 'KevJobs' });
});

/* POST register page. */
router.post('/', (req, res, next) => {
  console.log(req.body);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirm_password;
  const newRegistration = new Registration(name, email, password, confirmPassword);
  console.log(newRegistration);

  if (password !== confirmPassword) {
    res.locals.errorMessage = 'les mots de passes ne corespondent';
    res.render('login', { title: 'KevJobs' });
    return;
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      return;
    }

  const connection = connect();
  const query = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${hash}')`;

  connection.query(query, (error, results, fields) => {
    if (error) {
      console.log(error);
      return;
    }

    console.log('User registered successfully');
    res.redirect('/');
  });

  connection.end();
  });

});

module.exports = router;
