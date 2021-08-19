const PostImage = require("../../models/post_image");

module.exports = {
  postImageRead: async (req, res) => {
    const id = req.params.id;

    try {
      const image = await PostImage.findById(id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 게시물"
        });
      }

      res.header('Content-Type', 'image/png');
      res.send(image.image)
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    } 
  },
  postImageList: async (req, res) => {
    try {
      const images = await PostImage.find({});
      console.log(images)
      res.status(200).json({
        success: true,
        message: "게시물 조회 성공",
        data: images
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
}
