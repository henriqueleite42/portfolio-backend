const Skill = require('../models/Skill');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { between } = require('../functions/general');

module.exports = {
  search: async function (req = {}) {
    try {
      // Variables
      const conditions = {};
      const q = (req.query || {});

      // Conditions
      if (q.id) conditions._id = q.id;
      if (q.name) conditions.name = new RegExp('/.*'+q.name+'.*/');
      if (q.tag) conditions.tag = new RegExp('/.*'+q.tag+'.*/');

      // Find
      const skills = await Skill.find(conditions);

      // Response
      return {
        status: true,
        data: skills
      };
    } catch (e) {
      return {
        status: false,
        msg: e.message,
        data: []
      };
    }
  },

  create: async function (req) {
    try {
      // Simple Auth
      if (req.body.key !== process.env.AUTH) {
        throw new Error('User Not Allowed');
      }

      const success = [];
      const error = [];

      for (let item of req.body.data) {
        let {
          name,
          tag
        } = item;

        // Validation
        if (!between(name, 3, 20)) {
          error.push('Name Length must be between 3 and 20 characters');
        } else if (!between(tag, 2, 20)) {
          error.push('Tag Length must be between 2 and 26 characters');
        } else {
          success.push({
            name: name,
            tag: tag
          });
        }
      }

      // Save Skills
      const skills = await Skill.create(success);

      // Response
      return {
        status: true,
        data: skills
      };
    } catch (e) {
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
      }

      const success = [];
      const error = [];
      var skills = 0;

      for (let item of req.body.data) {
        let {
          id,
          _id,
          tag,
          name
        } = item;

        // Validation
        if (!id && !_id) {
          error.push('ID is required to Update a Record');
        } else if (name && !between(name, 3, 20)) {
          error.push('Name Length must be between 3 and 20 characters');
        } else if (tag && !between(tag, 2, 20)) {
          error.push('Tag Length must be between 2 and 26 characters');
        } else {
          temp = {};

          if (name) temp.name = name;
          if (tag) temp.tag = tag;

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
            data: skills,
            error: error
          })
        }

        success.forEach(async item => {
          temp = await Skill.updateOne(
            { _id: item.id },
            item.data
          );

          skills++;

          // Response
          if (skills === success.length) {
            res.json({
              status: true,
              data: skills,
              error: error
            })
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
  }
}