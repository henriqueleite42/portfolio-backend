// External Import
const router = require('express').Router();

const Project = require('../controllers/Project');

// Search
router.get('/search', async (req, res) => {
  const projects = await Project.search(req);
  res.json(projects);
});

// Create
router.post('/create', async (req, res) => {
  const projects = await Project.create(req);
  res.json(projects);
});

// Update
router.put('/update', async (req, res) => {
  await Project.update(req, res);
});

// Add Skill
router.put('/skill', async (req, res) => {
  const result = await Project.addSkill(req);
  res.json(result);
});

module.exports = app => app.use('/project', router);