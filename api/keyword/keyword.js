const Keyword = require("../../models/keyword");

module.exports = {
  // keywordRead: async (req, res) => {
  //   const id = req.params.id;

  //   try {
  //     const keyword = await Keyword.findById(id);

  //     if (!keyword) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "존재하지 않는 사진"
  //       });
  //     }

  //     res.header('Content-Type', 'keyword/png');
  //     res.send(keyword.keyword)
  //   } catch (e) {
  //     res.status(500).json({
  //       success: false,
  //       error: e
  //     });
  //   }
  // },
  keywordList: async (req, res) => {
    try {
      const keywords = await Keyword.find({});

      res.status(200).json({
        success: true,
        message: "사진 조회 성공",
        data: keywords
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  // keywordDelete: async (req, res) => {
  //   const id = req.params.id;

  //   try {
  //     const keyword = await Keyword.findByIdAndDelete(id);

  //     if (!keyword) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "존재하지 않는 사진"
  //       });      
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: "삭제 성공"
  //     });
  //   } catch (e) {
  //     res.status(500).json({
  //       success: false,
  //       error:e
  //     });
  //   }
  // },
}
