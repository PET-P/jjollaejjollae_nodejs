const mongoose = require('mongoose');

const { Schema } = mongoose;

const imageSchema = new Schema({
  image: Buffer,
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;