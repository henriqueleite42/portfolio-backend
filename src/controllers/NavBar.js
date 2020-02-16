const Project = require('./Project');
const Experience = require('./Experience');

module.exports = {
  search: async function () {
    try {
      const project = await Project.search({ query: { all: true } });
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
          }].concat(project.data)
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