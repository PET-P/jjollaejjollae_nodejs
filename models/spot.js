const mongoose = require('mongoose');

const { Schema } = mongoose;

const spotSchema = new Schema({
  category:{type:String, default: '관광지'},
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

spotSchema.index({title: 'text'})

const Spot = mongoose.model('Spot', spotSchema);
module.exports = Spot;