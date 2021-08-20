const Spot = require("../../models/spot");

module.exports = {
  spotCreate: async (req, res) => {
    const spot = new Spot(req.body);

    try {
      await spot.save((err, doc) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err
          });
        }
      });

      res.status(200).json({
        success: true,
        message: "관광지 등록 성공",
        data: spot
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  spotList: async (req, res) => {
    try {
      const spots = await Spot.find({});

      res.status(200).json({
        success: true,
        message: "관광지목록 조회 성공",
        data: spots
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  spotRead: async (req, res) => {
    const id = req.params.id;

    try {
      const spot = await Spot.findById(id);

      if (!spot) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 관광지"
        });
      }

      res.status(200).json({
        success: true,
        message: "관광지 조회 성공",
        data:spot
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  spotUpdate: async (req, res) => {
    const id = req.params.id;

    try {
      // new가 true이면 수정된 문서를 반환
      // runValidators가 true인 경우 업데이트 유효성 검사기를 실행
      const spot = await Spot.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!spot) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 관광지"
        });
      }

      res.status(200).json({
        success: true,
        message: "정보수정 성공",
        data: spot
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
  spotDelete: async (req, res) => {
    const id = req.params.id;

    try {
      const spot = await Spot.findByIdAndDelete(id);

      if (!spot) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 관광지"
        });      
      }

      res.status(200).json({
        success: true,
        message: "관광지삭제 성공"
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
}