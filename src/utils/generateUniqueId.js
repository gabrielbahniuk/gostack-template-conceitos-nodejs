const { uuid } = require('uuidv4');

module.exports = {
  generateUniqueId() {
    return uuid();
  },
};
