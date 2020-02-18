const Category = require('../models/Category');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { between } = require('../functions/general');

module.exports = {
  search: async function () {
    try {
      // Find
      const categories = await Category.find();

      // Response
      return {
        status: true,
        data: categories
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
        let { name, link } = item;

        // Validation
        if (!between(name, 3, 25)) {
          error.push('Name Length must be between 3 and 25 characters');
        } else {
          success.push({
            name: name,
            link: link
          });
        }
      }

      // Save Categories
      const categories = await Category.create(success);

      // Response
      return {
        status: true,
        data: categories
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
      var categories = 0;

      for (let item of req.body.data) {
        let {
          id,
          _id,
          name,
          link
        } = item;

        // Validation
        if (!id && !_id) {
          error.push('ID is required to Update a Record');
        } else {
          temp = {};

          if (name) temp.name = name;
          if (link) temp.link = link;

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
            data: categories,
            error: error
          })
        }

        success.forEach(async item => {
          await Category.updateOne(
            { _id: item.id },
            item.data
          );

          categories++;

          // Response
          if (categories === success.length) {
            res.json({
              status: true,
              data: categories,
              error: error
            })
          }
        })
      })
    } catch (e) {
      return {
        status: false,
        msg: e.message,
        data: []
      };
    }
  }
}