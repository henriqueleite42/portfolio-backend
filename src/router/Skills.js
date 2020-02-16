// External Import
const router = require('express').Router();

const Skill = require('../controllers/Skill');

// Search
router.get('/search', async (req, res) => {
  const skills = await Skill.search(req);
  res.json(skills);
});

// Create
router.post('/create', async (req, res) => {
  const skills = await Skill.create(req);
  res.json(skills);
});

// Update
router.put('/update', async (req, res) => {
  await Skill.update(req, res);
});

module.exports = app => app.use('/skill', router);