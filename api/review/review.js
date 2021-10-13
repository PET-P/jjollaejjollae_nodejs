const mongoose = require("mongoose");

const Review = require("../../models/review");
const Place = require("../../models/place");

module.exports = {
  reviewCreate: async (req, res) => {
    try {
      const userId = req.body.userId
      const placeId = req.body.placeId
      req.body.userId = mongoose.Types.ObjectId(userId)
      req.body.placeId = mongoose.Types.ObjectId(placeId)

      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const review = new Review(req.body);
      await review.save(async (err, doc) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err
          });
        }
        else {
          // let place = await Place.findById(review.placeId)
          // if (place.topReview.length < 2) {
          //   await place.updateOne({ $push: { topReview: { $each: [review._id], $position: 0 } } });
          // } else {
          //   await place.updateOne({ $push: { topReview: { $each: [review._id], $position: 0 } } });
          //   await place.updateOne({ $pop: { topReview: 1 } });
          // }

          return res.status(200).json({
            success: true,
            message: "리뷰 등록 성공",
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
  reviewLike: async (req, res) => {
    try {
      const reviewId = req.params.id
      const userId = req.userId
      const option = req.body.option
      console.log(userId)
      if (!reviewId)
        return res.status(400).json({ success: false, message: "reviewId 없음" })

      const target = ('like.list' + String(option))
      const query = {}
      query[target] = mongoose.Types.ObjectId(userId)
      const reviewLikeResult = await Review.updateOne(
        { _id: mongoose.Types.ObjectId(reviewId) },
        { $addToSet: query }
      )

      return res.status(200).json({
        success: true,
        message: reviewLikeResult,
      });

    } catch (e) {
      console.log(e)
      res.status(500).json({
        success: false,
        error: e
      });

    }
  },
  reviewLikeDelete: async (req, res) => {
    try {
      const reviewId = req.params.id
      const userId = req.userId

      if (!reviewId)
        return res.status(400).json({ success: false, message: "reviewId 없음" })
      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })

      const reviewLikeDeleteResult = await Review.updateOne(
        { _id: mongoose.Types.ObjectId(reviewId) },
        {
          $pull: {
            'like.list1': mongoose.Types.ObjectId(userId),
            'like.list2': mongoose.Types.ObjectId(userId),
            'like.list3': mongoose.Types.ObjectId(userId)
          }
        }
      )

      return res.status(200).json({
        success: true,
        message: reviewLikeDeleteResult,
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
      const { userId } = req.query;
      const { placeId, category } = req.query;

      if (placeId) {
        const [reviewInfo] = await Review.aggregate([
          { $match: { placeId: mongoose.Types.ObjectId(placeId) } },
          { $group: { _id: null, totalReview: { $sum: 1 }, totalPoint: { $sum: "$point" } } },
          { $addFields: { avgPoint: { $divide: ["$totalPoint", "$totalReview"] } } },
          {
            $project: {
              totalReview: 1,
              avgPoint: 1
            }
          }
        ])
        if (req.userId) {
          var reviews = await Review.aggregate([
            { $match: { placeId: mongoose.Types.ObjectId(placeId) } },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: '$user' },
            {
              $addFields: {
                representPet: {
                  $filter: {
                    input: "$user.pets",
                    as: "pet",
                    cond: { $eq: ["$$pet.isRepresent", true] }
                  }
                },
              }
            },
            {
              $project: {
                _id: 1,
                "user._id": 1,
                "user.nick": 1,
                "representPet.breed": 1,
                "representPet.age": 1,
                "representPet.size": 1,
                point: 1,
                imagesUrl: 1,
                satisfaction: 1,
                likeCnt: {
                  $sum: [
                    { $size: "$like.list1" },
                    { $size: "$like.list2" },
                    { $size: "$like.list3" }
                  ]
                },
                isLike: {
                  $or: [
                    { $in: [mongoose.Types.ObjectId(userId), "$like.list1"] },
                    { $in: [mongoose.Types.ObjectId(userId), "$like.list2"] },
                    { $in: [mongoose.Types.ObjectId(userId), "$like.list3"] }
                  ]
                },
                createdAt: 1,
              }
            }
          ]).exec();
        } else {
          var reviews = await Review.aggregate([
            { $match: { placeId: mongoose.Types.ObjectId(placeId) } },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: '$user' },
            {
              $addFields: {
                representPet: {
                  $filter: {
                    input: "$user.pets",
                    as: "pet",
                    cond: { $eq: ["$$pet.isRepresent", true] }
                  }
                }
              }
            },
            {
              $project: {
                _id: 1,
                "user._id": 1,
                "user.nick": 1,
                "representPet.breed": 1,
                "representPet.age": 1,
                "representPet.size": 1,
                point: 1,
                imagesUrl: 1,
                satisfaction: 1,
                likeCnt: {
                  $sum: [
                    { $size: "$like.list1" },
                    { $size: "$like.list2" },
                    { $size: "$like.list3" }
                  ]
                },
                createdAt: 1,
              }
            }
          ]).exec();
        }

        return res.status(200).json({
          success: true,
          message: "특정장소의 리뷰목록 조회 성공",
          data: reviews
        });
      } else if (userId) {

        const [reviewInfo] = await Review.aggregate([
          { $match: { userId: mongoose.Types.ObjectId(userId) } },
          {
            $group: {
              _id: null,
              totalReview: { $sum: 1 },
              totalLike: {
                $sum:
                  { $sum: [{ $size: '$like.list1' }, { $size: '$like.list2' }, { $size: '$like.list3' }] }
              }
            }
          }
        ]
        );
        const reviews = await Review.aggregate([
          { $match: { userId: mongoose.Types.ObjectId(userId) } },
          {
            $lookup: {
              from: 'places',
              localField: 'placeId',
              foreignField: '_id',
              as: 'place'
            }
          }, { $unwind: '$place' },
          {
            $project: {
              _id: 1,
              userId: 1,
              point: 1,
              imagesUrl: 1,
              satisfaction: 1,
              likeCnt: [{ $size: '$like.list1' }, { $size: '$like.list2' }, { $size: '$like.list3' }],
              'place._id': 1,
              'place.title': 1,
              createdAt: 1
            }
          }
        ]).exec();
        delete reviewInfo._id
        reviewInfo.reviws = reviews

        return res.status(200).json({
          success: true,
          message: "특정유저의 리뷰목록 조회 성공",
          data: reviewInfo
        });
      } else {
        const reviews = await Review.find({});

        res.status(200).json({
          success: true,
          message: "전체 리뷰목록 조회 성공",
          data: reviews
        });
      }
    } catch (e) {
      console.log(e)
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  // reviewRead: async (req, res) => {
  //   const id = req.params.id;

  //   try {
  //     const review = await Review.findById(id).select('point imagesUrl satisfaction user');

  //     if (!review) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "존재하지 않는 리뷰"
  //       });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: "리뷰 조회 성공",
  //       data: review
  //     });
  //   } catch (e) {
  //     res.status(500).json({
  //       success: false,
  //       error: e
  //     });
  //   }
  // },
  // reviewUpdate: async (req, res) => {
  //   try {
  //     const { userId } = req.body
  //     if (!userId)
  //       return res.status(400).json({ success: false, message: "userId 없음" })
  //     if (userId != req.userId)
  //       return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

  //     const id = req.params.id;
  //     // new가 true이면 수정된 문서를 반환
  //     // runValidators가 true인 경우 업데이트 유효성 검사기를 실행
  //     const review = await Review.findByIdAndUpdate(id, req.body, {
  //       new: true,
  //       runValidators: true,
  //     });

  //     if (!review) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "존재하지 않는 리뷰"
  //       });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       message: "정보수정 성공",
  //       data: review
  //     });
  //   } catch (e) {
  //     res.status(500).json({
  //       success: false,
  //       error: e
  //     });
  //   }
  // },
  reviewDelete: async (req, res) => {
    const id = req.params.id;

    try {
      const review = await Review.findByIdAndDelete(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 리뷰"
        });
      }

      return res.status(200).json({
        success: true,
        message: "리뷰 삭제 성공"
      });

    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
}