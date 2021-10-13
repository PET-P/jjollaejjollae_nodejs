const Place = require("../../models/place");
const Review = require('../../models/review');
const User = require('../../models/user');

const mongoose = require('mongoose')
module.exports = {
  placeCreate: async (req, res) => {
    const place = new Place(req.body);

    try {
      await place.save((err, doc) => {
        if (err) {
          console.log(err)
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
      console.log(e)
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
  nearPlaceList: async (req, res) => {
    try {
      const { latitude, longitude } = req.query;

      const nearPlaces = await Place.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [parseFloat(longitude), parseFloat(latitude)] },
            distanceField: "dist.calculated",
            maxDistance: 20000,
            spherical: true
          }
        },
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'placeId',
            as: 'reviews'
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            category: 1,
            address: 1,
            reviewCount: { $size: '$reviews' },
            reviewPoint: {
              $cond: { if: { $eq: [{ $avg: '$reviews.point' }, null] }, then: 0, else: { $avg: '$reviews.point' } }
            }
          }
        }
      ])
      res.status(200).json({
        success: true,
        message: "장소목록 조회 성공",
        data: nearPlaces
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
      const [place] = await Place.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'reviews',
            let: {
              'placeId': '$_id'
            },
            pipeline: [{
              '$match': { '$expr': { '$eq': ['$placeId', '$$placeId'] } }
            }, {
              '$sort': { 'createdAt': -1 }
            }, {
              '$limit': 2
            },
            ],
            as: 'reviews'
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            category: 1,
            description: 1,
            'reviews._id': 1,
            'reviews.point': 1,
            'reviews.imagesUrl': 1,
            'reviews.text': 1,
            'reviews.createdAt': 1,
            'reviews.userId': 1,
            location: 1,
            address: 1,
            imagesUrl: 1,
            phone: 1,
            'menu.name': 1,
            'menu.price': 1,
            'menu.imageUrl': 1,
            'room.name': 1,
            'room.price': 1,
            'room._id': 1,
            'room.imageUrl': 1,
            'room.subDescription': 1,
            icons: 1
          }
        }
      ]).exec();

      if (!place) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 장소"
        });
      } else {
        const userIdArray = []
        place.reviews.forEach(review => {
          userIdArray.push(mongoose.Types.ObjectId(review.userId))
        })

        const userNick = await User.find({ _id: { $in: userIdArray } }).select('_id nick').lean()
        place.reviews.forEach(review => {
          for (u of userNick) {
            if (String(review.userId) == String(u._id)) {
              review.nick = u.nick
              delete review.userId
            }
          }
        })

        res.status(200).json({
          success: true,
          message: "장소 조회 성공",
          data: place
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