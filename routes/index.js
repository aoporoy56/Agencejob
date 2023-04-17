const express = require('express');
const router = new express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('login', { title: 'KevJobs' });
});

router.get('/home', (req, res) => {
  res.render('home', { title: 'Home Page' });
});


router.get("/profile", (req, res) => {
  res.render('profile',{ title: 'KevJobs' });
});

module.exports = router;
