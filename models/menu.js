const mongoose = require('mongoose');
const { Schema } = mongoose;

const menuSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String}
}, { timestamps: true })

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;