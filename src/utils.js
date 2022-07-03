/* eslint-disable linebreak-style */
const fs = require('fs');

const writeTofile = (filename, content) => {
  fs.writeFileSync(filename, JSON.stringify(content), (err) => {
    if (err) throw err;
  });
};

module.exports = { writeTofile };
