const mongoose = require('mongoose');

const { Schema } = mongoose;

const folderSchema = new Schema({
  name: { type: String, required: true },
  regions: [String],
  startDate: { type: Date },
  endDate: { type: Date },
  count: { type: Number, required: true, default: 0 },
  contents: [{ type: mongoose.Types.ObjectId, ref: 'Place' }]
}, { timestamps: true })

const wishlistSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true },
  total: [mongoose.Types.ObjectId],
  totalCount: { type: Number, default: 0 },
  folder: [folderSchema],
  folderCount: { type: Number, default: 0 },
}, { timestamps: true })

wishlistSchema.pre('save', function (next) {
  let wishlist = this;

  wishlist.folder.push({ name: '나만의 위시리스트' })
  next();
})

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;