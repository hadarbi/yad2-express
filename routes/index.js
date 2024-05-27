const path = require('path');
const express = require('express');
const router = express.Router();

/* GET landing page. */
router.get('/', function (req, res, next) {
  res.sendFile('html/showAdsList.html', { root: path.join(__dirname, '../public') });
});

/* GET admin page. */
router.get('/admin', function (req, res, next) {
  res.sendFile('html/showAdsList.html', { root: path.join(__dirname, '../public') });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login');
});

/* GET createAd page. */
router.get('/createAd', function (req, res, next) {
  res.render('createAd');
});

module.exports = router;

