const mongoose = require('mongoose');

const { Schema } = mongoose;

const imageSchema = new Schema({
  image: Buffer,
});

const Image = mongoose.model('Image', imageSchema);

// Image.createNewInstance = async (img)=>{
//   try{
//     const img = req.file.buffer;
//     if(img.truncated) return res.status(413);
//     const image = new Image({ image:img });
//     console.log.image(img)
//     await image.save();
//     req.body.image_url = `/api/posts/image/${image._id}`
//   } catch (e) {
//     return res.status(500);
//   }
// }
module.exports = Image;