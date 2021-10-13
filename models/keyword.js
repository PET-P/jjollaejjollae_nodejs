const mongoose = require('mongoose');

const { Schema } = mongoose;

const keywordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User'},
  keyword: String,
}, { timestamps: true });

const Keyword = mongoose.model('Keyword', keywordSchema);
module.exports = Keyword;