const Counter = require('../models/Counter');

const generateComplaintNumber = async () => {
  const year = new Date().getFullYear();
  const counterName = `complaint_${year}`;

  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = String(counter.seq).padStart(5, '0');
  return `CMP-${year}-${paddedSeq}`;
};

module.exports = {
  generateComplaintNumber,
};
