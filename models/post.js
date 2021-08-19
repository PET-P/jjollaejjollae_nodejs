const mongoose = require('mongoose');

const { Schema } = mongoose;

const subContentSchema = new Schema( //{_id:false},
  {
  sub_title:{type:String, required:true},
  sub_text:{type:String, required:true}
});

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image_id: {
    type: Schema.Types.ObjectId
  },
  text: {
    type:String
  },
  sub_contents:[subContentSchema]
},
{timestamps:{createdAt: 'created_at',updatedAt: false}}
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;