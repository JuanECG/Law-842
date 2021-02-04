// DB Model
const Report = require('../models/Report');
const Operation = require('../models/Operation');

module.exports.getStatistics = async (req, res) => {
  try {
    res.json({
      reports: await Report.find().lean(),
      operations: await Operation.find().lean()
    });
  } catch (err) {
    res.status(400).send(err);
  }
};
