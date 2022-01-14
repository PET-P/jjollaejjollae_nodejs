const mongoose = require("mongoose");
const { findOneAndUpdate } = require("../../models/wishlist");
const Wishlist = require("../../models/wishlist");

function Counter(array) {
  array.forEach(val => this[val] = (this[val] || 0) + 1);
}

module.exports = {
  folderCreate: async (req, res) => {
    try {
      // const userId = req.body.userId
      // console.log(userId)
      const wishlist = await Wishlist.findOneAndUpdate(
        { userId: req.body.userId },
        { $push: { folder: { $each: [req.body.folder], $position: 0 } } },
        { new: true, runValidators: true }
      );
      if (!wishlist) {
        res.status(500).json({
          success: false,
          message: '문제발생'
        })
      } else {
        res.status(200).json({
          success: true,
          message: "위시리스트 생성 성공",
          data: wishlist
        })
      };
    } catch (e) {
      console.log(e)
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  folderList: async (req, res) => {
    try {
      const wishlists = await Wishlist.find({});

      res.status(200).json({
        success: true,
        message: "위시리스트 조회 성공",
        data: wishlists
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  folderRead: async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      // const wishlist = await Wishlist.findOne({ userId: userId });
      // const wishlist = await Wishlist.aggregate([
      //   { $match: { userId: mongoose.Types.ObjectId(userId) } },
      //   {
      //     $project: {

      //     }
      //   }
      // ]);
      const [wishlist] = await Wishlist.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { $unwind: '$folder' },
        {
          $lookup: {
            from: 'places',
            localField: 'folder.contents',
            foreignField: '_id',
            as: 'place'
          },
        },
        {
          $project: {
            _id: 1,
            total: 1,
            userId: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1,
            'folder.regions': {
              $map: {
                input: '$place',
                as: 'place',
                in: '$$place.address',
              }
            },
            // 'folder.contents': 1,
            'folder._id': 1,
            'folder.name': 1,
            'folder.startDate': 1,
            'folder.endDate': 1,
            'folder.updatedAt': 1,
            'folder.createdAt': 1,
          }
        },
        {
          $group: {
            _id: '$_id',
            total: { $first: '$total' },
            // totalCount: { $count: '$total' },
            folderCount: { $sum: 1 },
            userId: { $first: '$userId' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            __v: { $first: '$__v' },
            folder: { $addToSet: '$folder' }
          }
        },
      ]);
      // console.log(wishlist)
      wishlist.totalCount = wishlist.total.length

      // var regions = []
      wishlist.folder.forEach(folder => {
        let regions = folder.regions.map(x => x[0]);
        folder.count = regions.length
        const regionCounter = new Counter(regions)
        regions = Object.entries(regionCounter)
        regions = regions.sort(function (a, b) { return b[1] - a[1]; }).map(x => x[0]);
        folder.regions = regions.slice(0, 2)


      })

      // const regionCounter = new Counter(regions)
      // regions = Object.entries(regionCounter)
      // regions = regions.sort(function (a, b) { return b[1] - a[1]; }).map(x => x[0]);
      // result[0].regions = regions.slice(0, 2)



      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 사용자"
        });
      }

      res.status(200).json({
        success: true,
        message: "위시리스트 조회 성공",
        data: wishlist
      });
    } catch (e) {
      console.log(e)
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  folderUpdate: async (req, res) => {
    try {
      const userId = req.params.userId
      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const wishlist = await Wishlist.findOneAndUpdate(
        { userId: userId, "folder._id": req.query.folderId },
        { $set: { "folder.$.name": req.body.name, "folder.$.startDate": req.body.startDate, "folder.$.endDate": req.body.endDate } },
        { new: true, runValidators: true, }
      );

      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 위시리스트"
        });
      }

      res.status(200).json({
        success: true,
        message: "위시리스트 수정 성공",
        data: wishlist
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  folderDelete: async (req, res) => {
    try {
      const userId = req.params.userId
      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const wishlist = await Wishlist.findOneAndUpdate(
        { userId: userId },
        { $pull: { folder: { _id: req.query.folderId } } },
        { new: true }
      );

      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 위시리스트"
        });
      }

      if (!wishlist.imageId) {
        return res.status(200).json({
          success: true,
          message: "위시리스트 삭제 성공",
          data: wishlist
        });
      }

    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  wishAdd: async (req, res) => {
    try {
      const { userId, placeId, folderId } = req.body;

      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const wishlist = await Wishlist.findOneAndUpdate(
        { userId: userId, 'folder._id': folderId },
        { $push: { 'folder.$.contents': { $each: [placeId], $position: 0 }, total: { $each: [placeId], $position: 0 } } },
        // { $push: { 'folder.$.contents': { $each: [placeId], $position: 0 }, total: { $each: [placeId], $position: 0 }, 'folder.$.regions': { $each: [region], $position: 0 } } },
        { new: true }
      );
      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 유저 혹은 폴더"
        });
      } else {
        return res.status(200).json({
          success: true,
          message: '정상적으로 추가되었습니다.',
          data: wishlist
        })
      }
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  wishDelete: async (req, res) => {
    try {
      const { placeId, folderId } = req.query;
      const userId = req.params.userId;

      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })
      if (!folderId) {
        var wishlist = await Wishlist.findOneAndUpdate(
          { userId: userId },
          { $pull: { 'folder.$[].contents': placeId, total: placeId } },
          { new: true }
        );
      }
      else {
        var wishlist = await Wishlist.findOneAndUpdate(
          { userId: userId, 'folder._id': folderId },
          { $pull: { 'folder.$.contents': placeId, total: placeId } },
          { new: true }
        );
      }

      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 유저 혹은 폴더"
        });
      } else {
        return res.status(200).json({
          success: true,
          message: '정상적으로 삭제되었습니다.',
          data: wishlist
        })
      }

    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  wishRead: async (req, res) => {
    try {
      const userId = req.params.userId;
      const folderId = req.query.folderId;

      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      // const folder = await Wishlist.find({ userId: userId, 'folder._id': folderId }, { 'folder.$': 1 }).populate('folder.contents')

      const { region, category, filter } = req.query
      // const searchQuery = { address: new RegExp(region), category: category };
      const page = req.query.page == null ? 0 : req.query.page

      // if (filter == '리뷰 많은순')
      //   var sortParam = { reviewCount: -1 }
      // else if (filter == '최근 등록순')
      //   var sortParam = { createAt: -1 }
      // else if (filter == '별점 높은순')
      //   var sortParam = { reviewPoint: -1 }
      // else
      //   return res.status(401).json({
      //     success: false,
      //     message: "존재하지 않는 필터입니다.",
      //   });

      const result = await Wishlist.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { $unwind: "$folder" },
        { $match: { 'folder._id': mongoose.Types.ObjectId(folderId) } },
        {
          $lookup: {
            from: 'places',
            localField: 'folder.contents',
            foreignField: '_id',
            as: 'place'
          },
        },
        {
          $unwind: {
            path: "$place", preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'reviews',
            localField: 'place._id',
            foreignField: 'placeId',
            as: 'place.reviews'
          }
        },
        {
          $group: {
            _id: '$folder._id',
            name: { $first: '$folder.name' },
            startDate: { $first: '$folder.startDate' },
            endDate: { $first: '$folder.endDate' },
            regions: { $first: '$folder.regions' },
            contents: { $addToSet: '$place' },
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            startDate: 1,
            endDate: 1,
            regions: {
              $map: {
                input: '$contents',
                as: 'place',
                in: '$$place.address',
              }
            },
            count: { $size: '$regions' },
            contents: {
              $map: {
                input: '$contents',
                as: 'place',
                in: {
                  _id: '$$place._id',
                  location: '$$place.location',
                  address: '$$place.address',
                  imagesUrl: '$$place.imagesUrl',
                  title: '$$place.title',
                  category: '$$place.category',
                  reviewCount: { $size: '$$place.reviews' },
                  reviewPoint: {
                    $cond: { if: { $eq: [{ $avg: '$$place.reviews.point' }, null] }, then: 0, else: { $avg: '$$place.reviews.point' } }
                  }
                }
              }
            }
          }
        },
      ]);

      // console.log(result)

      result[0].count = result[0].regions.length
      // if (!result[0].regions[0]){
      //   result[0].count = 0
      //   result[0].regions = []
      // }
      // console.log(result[0].count)
      // console.log(result[0].regions)
      // console.log(result[0].contents[0])


      if (result[0].count != 0 && result[0].regions[0] == null) {
        // console.log(result[0].count)

        result[0].regions = []

        result[0].contents = []
        result[0].count = 0

      }
      else {
        // console.log(result[0].count)

        var regions = result[0].regions.map(x => x[0]);

        const regionCounter = new Counter(regions)
        regions = Object.entries(regionCounter)
        regions = regions.sort(function (a, b) { return b[1] - a[1]; }).map(x => x[0]);
        result[0].regions = regions.slice(0, 2)
      }

      for (content of result[0].contents) {
        content.isWish = true
      }
      if (result.length == 0) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 유저 혹은 폴더"
        });
      } else {

        return res.status(200).json({
          success: true,
          message: '정상적으로 조회되었습니다.',
          data: result[0]
        })
      }
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  totalList: async (req, res) => {
    try {
      const userId = req.params.userId;
      const filter = req.query.filter;

      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      if (filter == '리뷰 많은순')
        var sortParam = { reviewCount: -1, _id: -1 }
      else if (filter == '최근 등록순')
        var sortParam = { _id: -1 }
      else if (filter == '별점 높은순')
        var sortParam = { reviewPoint: -1, _id: -1 }
      else
        return res.status(401).json({
          success: false,
          message: "존재하지 않는 필터입니다.",
        });

      var [totalListResult] = await Wishlist.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { $unwind: '$folder' },
        { $group: { _id: '$_id', folderCount: { $sum: 1 }, totalContents: { $push: '$folder.contents' } } },
        {
          $addFields: {
            "totalContents": {
              "$reduce": {
                "input": "$totalContents",
                "initialValue": [],
                "in": { "$concatArrays": ["$$value", "$$this"] }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'places',
            localField: 'totalContents',
            foreignField: '_id',
            as: 'totalContents'
          }
        },
        { $unwind: '$totalContents' },
        {
          $lookup: {
            from: 'reviews',
            localField: 'totalContents._id',
            foreignField: 'placeId',
            as: 'totalContents.reviews'
          }
        },
        {
          $group: {
            _id: '$_id', folderCount: { $first: '$folderCount' }, totalCount: { $sum: 1 },
            totalContents: { $addToSet: '$totalContents' }
          }
        },
        {
          $project: {
            _id: 1, folderCount: 1, totalCount: 1, totalContents: {
              $map: {
                input: '$totalContents',
                as: 'place',
                in: {
                  _id: '$$place._id',
                  location: '$$place.location',
                  address: '$$place.address',
                  imagesUrl: '$$place.imagesUrl',
                  title: '$$place.title',
                  category: '$$place.category',
                  reviewCount: { $size: '$$place.reviews' },
                  reviewPoint: {
                    $cond: { if: { $eq: [{ $avg: '$$place.reviews.point' }, null] }, then: 0, else: { $avg: '$$place.reviews.point' } }
                  }
                }
              }
            }
          }
        },
        { $unwind: '$totalContents' },
        { $sort: sortParam },
        {
          $group: {
            _id: '$_id', folderCount: { $first: '$folderCount' }, totalCount: { $sum: 1 },
            totalContents: { $addToSet: '$totalContents' }
          }
        },


      ]);

      // console.log(totalListResult)
      if (totalListResult == undefined) {
        totalListResult = {
          _id: ''
          , folderCount: 0
          , totalCount: 0
          , totalContents: []
        }
      }
      return res.status(200).json({
        success: true,
        message: '정상적으로 조회되었습니다.',
        data: totalListResult
      })
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
        error: e.message
      })
    }
  },
  wishDeleteById: async (req, res) => {
    try {
      const { placeId } = req.query;
      const userId = req.params.userId;

      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const wishlist = await Wishlist.findOneAndUpdate(
        { userId: userId },
        { $pull: { 'folder.$[].contents': placeId, total: placeId } },
        { new: true }
      );

      // console.log(wishlist)
      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 유저 혹은 폴더"
        });
      } else {
        return res.status(200).json({
          success: true,
          message: '정상적으로 삭제되었습니다.',
          data: wishlist
        })
      }

    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
        error: e
      });
    }
  },
}