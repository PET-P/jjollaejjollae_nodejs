const mongoose = require("mongoose");

const Review = require("../../models/review");
const Place = require("../../models/place");

module.exports = {
  reviewCreate: async (req, res) => {
    try {
      const uid = req.body.userId
      const pid = req.body.placeId
      req.body.userId = mongoose.Types.ObjectId(uid)
      req.body.placeId = mongoose.Types.ObjectId(pid)

      const review = new Review(req.body);

      await review.save(async (err, doc) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err
          });
        }
        else {
          let place = await Place.findById(review.placeId)
          if (place.topReview.length < 2) {
            await place.updateOne({ $push: { topReview: { $each: [review._id],$position:0 } } });
          } else {
            await place.updateOne({ $push: { topReview: { $each: [review._id],$position:0 } } });
            await place.updateOne({ $pop: { topReview: 1 } });
          }

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
      const reviews = await Review.find({});

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
      const review = await Review.findById(id);

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
      const review = await Review.findByIdAndUpdate(id, req.body, {
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
      const review = await Review.findByIdAndDelete(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 리뷰"
        });
      }

      if (!review.imagesId) {
        return res.status(200).json({
          success: true,
          message: "리뷰 삭제 성공"
        });
      }

      req.imagesId = review.imagesId
      next();
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
}