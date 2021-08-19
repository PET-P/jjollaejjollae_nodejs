const mongoose = require('mongoose');

const { Schema } = mongoose;

const postImageSchema = new Schema({
  image: Buffer,
});

const PostImage = mongoose.model('PostImage', postImageSchema);

// PostImage.createNewInstance = async (img)=>{
//   try{
//     const img = req.file.buffer;
//     if(img.truncated) return res.status(413);
//     const image = new PostImage({ image:img });
//     console.log.image(img)
//     await image.save();
//     req.body.image_url = `/api/posts/image/${image._id}`
//   } catch (e) {
//     return res.status(500);
//   }
// }
module.exports = PostImage;