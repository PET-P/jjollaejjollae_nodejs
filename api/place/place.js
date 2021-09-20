const Place = require("../../models/place");
const Review = require('../../models/review');

module.exports = {
  placeCreate: async (req, res) => {
    const place = new Place(req.body);

    try {
      await place.save((err, doc) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err
          });
        }
        else {
          res.status(200).json({
            success: true,
            message: "장소 등록 성공",
            data: doc
          });
        }
      });


    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  placeList: async (req, res) => {
    try {
      const places = await Place.find({});

      res.status(200).json({
        success: true,
        message: "장소목록 조회 성공",
        data: places
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  placeRead: async (req, res) => {
    const id = req.params.id;

    try {
      const place = await Place.findById(id);

      if (!place) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 장소"
        });
      } else {
        res.status(200).json({
          success: true,
          message: "장소 조회 성공",
          data: place
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  placeUpdate: async (req, res) => {
    const id = req.params.id;

    try {
      // new가 true이면 수정된 문서를 반환
      // runValidators가 true인 경우 업데이트 유효성 검사기를 실행
      const place = await Place.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!place) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 장소"
        });
      }

      res.status(200).json({
        success: true,
        message: "정보수정 성공",
        data: place
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  placeDelete: async (req, res) => {
    const id = req.params.id;

    try {
      const place = await Place.findByIdAndDelete(id);

      if (!place) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 장소"
        });
      }

      res.status(200).json({
        success: true,
        message: "장소삭제 성공"
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
}