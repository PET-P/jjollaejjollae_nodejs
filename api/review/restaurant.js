const mongoose = require("mongoose");

const { RestaurantReview } = require("../../models/review");

module.exports = {
  reviewCreate: async (req, res) => {
    try {
      uid = req.body.user_id
      pid = req.body.place_id
      req.body.user_id = mongoose.Types.ObjectId(uid)
      req.body.place_id = mongoose.Types.ObjectId(pid)
      
      const review = new RestaurantReview(req.body);

      await review.save((err, doc) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err
          });
        }
        else {
          return res.status(200).json({
            success: true,
            message: "리뷰 등록 성공",
            data: doc
          });
        }
      });
    } catch (e) {
      console.log(e)
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  reviewList: async (req, res) => {
    try {
      const reviews = await RestaurantReview.find({});

      res.status(200).json({
        success: true,
        message: "리뷰목록 조회 성공",
        data: reviews
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  reviewRead: async (req, res) => {
    const id = req.params.id;

    try {
      const review = await RestaurantReview.findById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 리뷰"
        });
      }

      res.status(200).json({
        success: true,
        message: "리뷰 조회 성공",
        data: review
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  reviewUpdate: async (req, res) => {
    const id = req.params.id;

    try {
      // new가 true이면 수정된 문서를 반환
      // runValidators가 true인 경우 업데이트 유효성 검사기를 실행
      const review = await RestaurantReview.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 리뷰"
        });
      }

      res.status(200).json({
        success: true,
        message: "정보수정 성공",
        data: review
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  reviewDelete: async (req, res, next) => {
    const id = req.params.id;

    try {
      const review = await RestaurantReview.findByIdAndDelete(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 리뷰"
        });
      }

      if (!review.images_id) {
        return res.status(200).json({
          success: true,
          message: "리뷰 삭제 성공"
        });
      }

      req.images_id = review.images_id
      next();
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
}