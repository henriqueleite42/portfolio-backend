const Project = require('../models/Project');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { between, getYear } = require('../functions/general');

module.exports = {
  search: async function (req = {}) {
    try {
      // Variables
      const q = (req.query || {});

      var conditions = { active: true };
      var limit = parseInt(process.env.PAGE_LIMIT);
      var populate = [
        'skills',
        'category'
      ];
      var sort = { difficulty: -1 };
      var page = 1;
      var fields = {
        name: 1,
        link: 1,
        difficulty: 1,
        img: 1,
        creation: 1,
        skills: 1,
        category: 1
      };

      // Conditions
      if (q.id) conditions._id = { $in: q.id.split(',') };
      if (q.name) conditions.name = new RegExp(q.name, 'i');
      if (q.creation) conditions.creation = { $in: q.creation.split(',') };
      if (q.skills) conditions.skills = { $in: q.skills.split(',') };
      if (q.category) conditions.category = q.category;
      if (q.active === 'all') delete conditions.active;
      else if (q.active) conditions.active = false;
      if (q.difficulty) {
        switch (q.difficulty.toLowerCase()) {
          case 'easy':
            conditions.difficulty = { $lt: 1.6 }
            break;
          case 'normal':
            conditions.difficulty = { $gt: 1.5, $lt: 3.6 }
            break;
          case 'hard':
            conditions.difficulty = { $gt: 3.5 }
            break;
          default:
            break;
        }
      };

      // Sort
      if (q.sort && q.dir) {
        let dir = -1;
        if (q.dir.toUppperCase() === "ASC") dir = 1;

        switch (q.sort) {
          case 'creation':
            sort = { creation: dir };
            break;
          case 'difficulty':
            sort = { difficulty: dir };
            break;
          case 'name':
          default:
            sort = { name: dir };
            break;
        }
      }

      // Pagination
      if (q.limit) limit = q.limit;
      else if (q.all) limit = 1000;
      if (q.page) page = Math.ceil(q.page);

      // Search Mode
      switch (q.mode) {
        case 'complete':
          break;
        case 'list':
          fields.skills = { $slice: 5 };
          break;
        case 'menu':
        default:
          fields = {
            name: 1,
            link: 1
          };

          populate = [
            '',
            ''
          ];

          sort = {
            name: 1
          }
          break;
      }

      // Total
      var total = await Project.countDocuments(conditions)
      total = Math.ceil(total / limit);

      // Find
      const projects = await Project.find(conditions, fields)
      .skip(((page - 1) * limit))
      .limit(limit)
      .sort(sort)
      .populate(populate[0])
      .populate(populate[1]);

      return {
        status: true,
        total: total,
        page: page,
        data: projects
      };
    } catch (e) {
      return {
        status: false,
        msg: e.message,
        data: []
      }
    }
  },

  create: async function (req) {
    try {
      // Simple Auth
      if (req.body.key !== process.env.AUTH) {
        throw new Error('User Not Allowed');
      } else if (!req.body.data) {
        throw new Error('No Data Received');
      } else if (req.body.data.name) {
        req.body.data = [req.body.data];
      }

      // Variables
      const success = [];
      const error = [];

      // Validate
      for (let item of req.body.data) {
        // Variables
        var {
          name,
          link,
          creation,
          difficulty,
          img,
          skills,
          category
        } = item;

        // Validation
        if (!between(name, 3, 26)) {
          error.push('Name Length must be between 3 and 26 characters');
        } else if (!between(link, 3, 26)) {
          error.push('Link Length must be between 3 and 26 characters');
        } else if (creation < 2019 || creation > getYear()) {
          error.push('Creation must be greater than 2019 and less than ' + getYear());
        } else if (![0.5,1,1.5,2,2.5,3,3.5,4,4.5,5].includes(difficulty)) {
          error.push('Difficulty must be between 0.5 and 5');
        } else if (!skills || skills.length < 1) {
          error.push('At leat one Skill is required');
        } else {
          success.push({
            name: name,
            link: link,
            creation: creation,
            difficulty: difficulty,
            skills: skills,
            img: (img || ""),
            category: category
          });
        }
      }

      // Save Project
      const projects = await Project.create(success);

      // Response
      return {
        status: true,
        data: projects,
        error: error
      };
    } catch (e) {
      // Response
      return {
        status: false,
        msg: e.message,
        data: []
      };
    }
  },

  update: async (req, res) => {
    try {
      // Simple Auth
      if (req.body.key !== process.env.AUTH) {
        throw new Error('User Not Allowed');
      } else if (!req.body.data) {
        throw new Error('No Data Received');
      } else if (req.body.data.name) {
        req.body.data = [req.body.data];
      }

      // Variables
      const success = [];
      const error = [];
      var projects = 0;
      let temp;

      // Validate
      for (let item of req.body.data) {
        // Variables
        var {
          id,
          _id,
          img,
          name,
          link,
          active,
          creation,
          skills,
          difficulty,
          category
        } = item;

        // Validation
        if (!id && !_id) {
          error.push('ID is required to Update a Record');
        } else if (name && !between(name, 3, 26)) {
          error.push('Name Length must be between 3 and 26 characters');
        } else if (link && !between(link, 3, 26)) {
          error.push('Link Length must be between 3 and 26 characters');
        } else if (creation && (creation < 2019 || creation > getYear())) {
          error.push('Creation must be greater than 2019 and less than ' + getYear());
        } else if (difficulty && ![0.5,1,1.5,2,2.5,3,3.5,4,4.5,5].includes(difficulty)) {
          error.push('Difficulty must be between 0.5 and 5');
        } else if (skills && skills.length < 1) {
          error.push('At leat one Skill is required');
        } else {
          temp = {};

          if (name) temp.name = name;
          if (link) temp.link = link;
          if (creation) temp.creation = creation;
          if (difficulty) temp.difficulty = difficulty;
          if (skills) temp.skills = skills;
          if (active) temp.active = active;
          if (img) temp.img = img;
          if (category) temp.category = category;

          success.push({
            id: (id || _id),
            data: temp
          });
        }
      }

      // Save Project
      new Promise((resolve, reject) => {
        if (success.length === 0) {
          res.json({
            status: true,
            data: projects,
            error: error
          })
        }

        success.forEach(async item => {
          temp = await Project.updateOne(
            { _id: item.id },
            item.data
          );

          projects++;

          // Response
          if (projects === success.length) {
            res.json({
              status: true,
              data: projects,
              error: error
            });
          }
        })
      })
    } catch (e) {
      // Response
      res.json({
        status: false,
        msg: e.message,
        data: []
      });
    }
  },

  addSkill: async function (req) {
    try {
      // Simple Auth
      if (req.body.key !== process.env.AUTH) {
        throw new Error('User Not Allowed');
      } else if (!req.body.data) {
        throw new Error('No Data Received');
      } else if (!req.body.data.id && !req.body.data._id) {
        throw new Error('ID is required to add a new Skill to a Project');
      } else {
        if (typeof req.body.data.data == 'string') {
          req.body.data.data = [req.body.data.data];
        }

        var success = 0;

        let result = await Project.updateOne(
          { _id: (req.body.data.id || req.body.data._id) },
          { $push: { skills: { $each: req.body.data.data } } }
        );

        success = result.nModified;

        // Response
        return {
          status: true,
          data: success+" records modified"
        };
      }
    } catch (e) {
      // Response
      return {
        status: false,
        msg: e.message
      };
    }
  }
}