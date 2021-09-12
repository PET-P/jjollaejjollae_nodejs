const mongoose = require('mongoose');

const { Schema } = mongoose;

const folderSchema = new Schema({
  name: { type: String, required: true },
  regions: [String],
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  count: { type: Number, required: true, default: 0 },
  contents: [{ type: mongoose.Types.ObjectId, ref: 'Place' }]
})
const wishlistSchema = new Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true },
  total: [mongoose.Types.ObjectId],
  total_count: { type: Number, default: 0 },
  folder: [folderSchema],
  folder_count: { type: Number, default: 0 },
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;