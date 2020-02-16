// External Import
const router = require('express').Router();

const NavBar = require('../controllers/NavBar');

// Search
router.get('/search', async (req, res) => {
  const navBar = await NavBar.search();
  res.json(navBar);
});

module.exports = app => app.use('/navbar', router);