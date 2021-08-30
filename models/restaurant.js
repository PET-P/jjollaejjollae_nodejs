const mongoose = require('mongoose');

const { Schema } = mongoose;

const restaurantSchema = new Schema({
  category:{type:String, default: '식당'},
  title: {
    type: String,
    required: true
  },
  address: [String], // 0. 시/도 1. 시/군/구 2.읍/면/동 4.나머지
  description: { type: String },
  review_point: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },
  top_review: [],
  phone: { type: String, required: true },
  image_id: { type: Schema.Types.ObjectId },
  icons: [String],
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

restaurantSchema.index({title: 'text'})

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;