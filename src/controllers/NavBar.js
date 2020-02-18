const Category = require('./Category');
const Experience = require('./Experience');

module.exports = {
  search: async function () {
    try {
      const categories = await Category.search();
      // const experience = Experience.search();
      const experience = {
        data: [{
          name: 'NFSERVICE',
          link: 'nfservice'
        }]
      };

      const navBar = [
        {
          name: "About",
          link: [""],
          icon: "user"
        },
        {
          name: "Projects",
          link: ["projects"],
          icon: "briefcase",
          subItens: [{
            name: 'All',
            link: ''
          }].concat(categories.data)
        },
        {
          name: "Work Experience",
          link: ["experience"],
          icon: "laptop-code",
          subItens: [{
            name: 'All',
            link: ''
          }].concat(experience.data)
        },
        {
          name: "Contact",
          link: ["contact"],
          icon: "phone-alt"
        }
      ];

      return navBar;
    } catch (e) {
      return [];
    }
  }
}