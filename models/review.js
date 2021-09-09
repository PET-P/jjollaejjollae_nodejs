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
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  place_id: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
  point: { type: Number, default: 10 },
  images_id: [Schema.Types.ObjectId],
  text: { type: String, required: true },
  likes: likesSchema,
  thumbnail_id: { type: Schema.Types.ObjectId },
  satisfaction: [String],
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Review = mongoose.model('Review', reviewSchema);
// const CafeReview = mongoose.model('CafeReview', reviewSchema);
// const RestaurantReview = mongoose.model('RestaurantReview', reviewSchema);
// const SpotReview = mongoose.model('SpotReview', reviewSchema);


module.exports = Review;