const mongoose = require('mongoose');
const { Schema } = mongoose;

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
  cancelRule: { type: String }
}, { timestamps: true })

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;