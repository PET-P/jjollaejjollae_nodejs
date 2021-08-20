const mongoose = require('mongoose');

const { Schema } = mongoose;

const cafeSchema = new Schema({
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
  icons: [String],
  image_id: { type: Schema.Types.ObjectId },
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Cafe = mongoose.model('Cafe', cafeSchema);
module.exports = Cafe;