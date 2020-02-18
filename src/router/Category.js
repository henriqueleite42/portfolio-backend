// External Import
const router = require('express').Router();

const Category = require('../controllers/Category');

// Search
router.get('/search', async (req, res) => {
  const categories = await Category.search(req);
  res.json(categories);
});

// Create
router.post('/create', async (req, res) => {
  const categories = await Category.create(req);
  res.json(categories);
});

// Update
router.put('/update', async (req, res) => {
  await Category.update(req, res);
});

module.exports = app => app.use('/category', router);