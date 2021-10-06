const mongoose = require('mongoose');

const { Schema } = mongoose;

const subContentSchema = new Schema({
  subTitle: { type: String, required: true },
  subText: { type: String, required: true }
}, { timestamps: true });

const postSchema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String },
  text: { type: String },
  subContents: [subContentSchema]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;