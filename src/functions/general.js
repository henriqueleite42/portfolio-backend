module.exports = {
  between: (item, min, max) => {
    if (item.length) {
      if (item.length >= min && item.length <= max) return true;
      else false;
    } else {
      return false;
    }
  },

  getYear: () => (new Date()).getFullYear(),

  arrayDiff: (bigger, smaller) => bigger.filter((i) => smaller.indexOf(i) < 0),

  onlyUnique: function (value, index, self) {
    return self.indexOf(value) === index;
  }
}