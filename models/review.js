const mongoose = require('mongoose');

const { Schema } = mongoose;
const likesSchema = new Schema({
  total: { type: Number, default: 0 },
  count1: { type: Number, default: 0 },
  list1: [Schema.Types.ObjectId],
  count2: { type: Number, default: 0 },
  list2: [Schema.Types.ObjectId],
  count3: { type: Number, default: 0 },
  list3: [Schema.Types.ObjectId],
})

const reviewSchema = new Schema({
  category: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  placeId: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
  point: { type: Number, default: 10 },
  imagesUrl: [String],
  text: { type: String, required: true },
  like: { type: likesSchema, default: () => ({}) },
  thumbnailId: { type: Schema.Types.ObjectId },
  satisfaction: [String],
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;