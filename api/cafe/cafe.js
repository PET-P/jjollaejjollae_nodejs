const Cafe = require("../../models/cafe");

module.exports = {
  cafeCreate: async (req, res) => {
    const cafe = new Cafe(req.body);

    try {
      await cafe.save((err, doc) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err
          });
        }
      });

      res.status(200).json({
        success: true,
        message: "카페 등록 성공",
        data: cafe
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  cafeList: async (req, res) => {
    try {
      const cafes = await Cafe.find({});

      res.status(200).json({
        success: true,
        message: "카페목록 조회 성공",
        data: cafes
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  cafeRead: async (req, res) => {
    const id = req.params.id;

    try {
      const cafe = await Cafe.findById(id);

      if (!cafe) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 카페"
        });
      }

      res.status(200).json({
        success: true,
        message: "카페 조회 성공",
        data:cafe
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  cafeUpdate: async (req, res) => {
    const id = req.params.id;

    try {
      // new가 true이면 수정된 문서를 반환
      // runValidators가 true인 경우 업데이트 유효성 검사기를 실행
      const cafe = await Cafe.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!cafe) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 카페"
        });
      }

      res.status(200).json({
        success: true,
        message: "정보수정 성공",
        data: cafe
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
  cafeDelete: async (req, res) => {
    const id = req.params.id;

    try {
      const cafe = await Cafe.findByIdAndDelete(id);

      if (!cafe) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 카페"
        });      
      }

      res.status(200).json({
        success: true,
        message: "카페삭제 성공"
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
}