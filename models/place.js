const mongoose = require('mongoose');
const { Schema } = mongoose;

const menuSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String }
}, { timestamps: true })

const roomSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  subDescription: { type: String },
  petFacilities: [String],
  facilities: [String],
  description: { type: String },
  icons: [String],
  information: { type: String },
  reservationNotice: { type: String },
  cancleRule: { type: String }
}, { timestamps: true })

const placeSchema = new Schema({
  category: { type: String, enum: ['숙소', '카페', '식당', '관광지'], required: true },
  title: { type: String, trim: true, required: true },
  address: [String], // 0. 시/도 1. 시/군/구 2.읍/면/동 4.나머지
  description: { type: String },
  menu: [menuSchema],
  room: [roomSchema],
  // reviewPoint: { type: Number, default: 0 },
  // reviewCount: { type: Number, default: 0 },
  // topReview: [{ type: mongoose.Types.ObjectId, ref: 'Reveiw' }],
  phone: { type: String, required: true },
  imagesId: [Schema.Types.ObjectId],
  types: [String],
  petFacilities: [String], //숙소 필터
  facilities: [String], // 숙소 필터
  icons: [String],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: []
  }
}, { timestamps: true });

const Place = mongoose.model('Place', placeSchema);
module.exports = Place;