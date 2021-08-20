const Image = require('../models/image')

module.exports = {
  saveImage: async (req, res, next) => {
    try {
      if (req.file) {
        const img = req.file.buffer;
        if (img.truncated) return res.status(413);

        const image = await Image.create({ image: img })
        await image.save();
        req.body.image_id = image._id
        next()
      }
      else {
        next()
      }
    } catch (e) {
      console.log(e)
      return res.status(500);
    }
  },
  deleteImage: async function (req, res) {
    try {
      const image = await Image.findByIdAndDelete(req.image_id)

      if (!image) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 사진"
        });
      }

      res.status(200).json({
        success: true,
        message: "게시물 삭제 성공"
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  }

}

