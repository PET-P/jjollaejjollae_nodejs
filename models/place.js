const mongoose = require('mongoose');

const { Schema } = mongoose;

const placeSchema = new Schema({
  category:{type:String, enum: ['숙소','카페','식당','관광지'],required:true},
  title: {
    type: String,
    required: true
  },
  address: [String], // 0. 시/도 1. 시/군/구 2.읍/면/동 4.나머지
  description: { type: String },
  review_point: { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },
  top_review: [{type: mongoose.Types.ObjectId, ref:'Reveiw'}],
  phone: { type: String, required: true },
  images_id: [Schema.Types.ObjectId],
  types: [String],
  pet_facilities: [String],
  facilities: [String],
  icons:[String]
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// placeSchema.index({title: 'text'})

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;