const Accomm = require("../../models/accomm");

module.exports = {
  accommCreate: async (req, res) => {
    const accomm = new Accomm(req.body);

    try {
      await accomm.save((err, doc) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err
          });
        }
      });

      res.status(200).json({
        success: true,
        message: "숙소 등록 성공",
        data: accomm
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  accommList: async (req, res) => {
    try {
      const accomms = await Accomm.find({});

      res.status(200).json({
        success: true,
        message: "숙소목록 조회 성공",
        data: accomms
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  accommRead: async (req, res) => {
    const id = req.params.id;

    try {
      const accomm = await Accomm.findById(id);

      if (!accomm) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 숙소"
        });
      }

      res.status(200).json({
        success: true,
        message: "숙소 조회 성공",
        data:accomm
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  accommUpdate: async (req, res) => {
    const id = req.params.id;

    try {
      // new가 true이면 수정된 문서를 반환
      // runValidators가 true인 경우 업데이트 유효성 검사기를 실행
      const accomm = await Accomm.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!accomm) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 숙소"
        });
      }

      res.status(200).json({
        success: true,
        message: "정보수정 성공",
        data: accomm
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
  accommDelete: async (req, res) => {
    const id = req.params.id;

    try {
      const accomm = await Accomm.findByIdAndDelete(id);

      if (!accomm) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 숙소"
        });      
      }

      res.status(200).json({
        success: true,
        message: "숙소삭제 성공"
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
}