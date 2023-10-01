const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  name: [String], // Change the type to an array of strings
});

const Interest = mongoose.model('Interest', interestSchema);

module.exports = Interest;