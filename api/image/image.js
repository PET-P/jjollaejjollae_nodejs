const Image = require("../../models/image");

module.exports = {
  imageRead: async (req, res) => {
    const id = req.params.id;

    try {
      const image = await Image.findById(id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 사진"
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
  imageList: async (req, res) => {
    try {
      const images = await Image.find({},'_id');
      data = []
      for (let i of images){
        data.push(i._id)
      }
      res.status(200).json({
        success: true,
        message: "사진 조회 성공",
        data: data
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  imageDelete: async (req, res) => {
    const id = req.params.id;

    try {
      const image = await Image.findByIdAndDelete(id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 사진"
        });      
      }

      res.status(200).json({
        success: true,
        message: "삭제 성공"
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
}
