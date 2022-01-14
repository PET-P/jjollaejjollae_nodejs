const mongoose = require('mongoose');

const { Schema } = mongoose;

const reportSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  reportId: { type: Schema.Types.ObjectId, ref: 'Report' },
  option: String,
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;