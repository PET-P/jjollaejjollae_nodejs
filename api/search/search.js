const Place = require('../../models/place')
const Keyword = require('../../models/keyword')
const Wishlist = require('../../models/wishlist')
const mongoose = require('mongoose')

module.exports = {
  search: async (req, res) => {
    try {
      const userIdFromJWT = req.userId
      const page = req.query.page == null ? 0 : req.query.page

      const regions = [
        '제주특별자치도', '제주도', '제주',
        '부산광역시', '부산시', '부산',
        '서울특별시', '서울시', '서울',
        '강릉시', '강릉', '속초시', '속초', '강원도', '강원',
        '경주시', '경주', '여수시', '여수',
        '대구광역시', '대구시', '대구',]
      const keyword = req.query.keyword

      const keywordLog = new Keyword({ 'userId': (req.userId == null ? null : mongoose.Types.ObjectId(req.userId)), 'keyword': keyword });
      await keywordLog.save();

      let region = ''
      for (r of regions) {
        if (keyword.indexOf(r) !== -1) {
          region = r.substring(0, 2)
          var key = keyword.replace(r, '').trim()
          break
        }
      }

      if (region === '') {
        // console.log(keyword + '|' + keyword.replace(/\s/gi, ''))
        const searchQuery = { title: new RegExp(keyword + '|' + keyword.replace(/\s/gi, '')) }
        const result = await Place.aggregate([
          { $match: searchQuery },
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
              location: 1,
              imagesUrl: 1,
              reviewCount: { $size: '$reviews' },
              reviewPoint: {
                $cond: { if: { $eq: [{ $avg: '$reviews.point' }, null] }, then: 0, else: { $avg: '$reviews.point' } }
              },
            }
          },
          {
            $sort: { reviewPoint: -1, reviewCount: -1, _id: 1 }
          },
          { $skip: page * 6 }, { $limit: 6 }
        ])

        const placeCount = await Place.countDocuments(searchQuery).exec();;

        if (userIdFromJWT) {
          const [wish] = await Wishlist.find({ userId: mongoose.Types.ObjectId(userIdFromJWT) })
          result.forEach(r => {
            r.isWish = false
            for (w of wish.folder) {
              if (w.contents.includes(r._id)) {
                r.isWish = true
                break
              }
            }
          })
        }
        res.status(200).json({
          success: true,
          message: '검색결과',
          data: {
            region: '없음',
            regionCount: 0,
            placeCount: placeCount,
            result: result
          }
        })
      } else {

        if (key == '') {
          var searchQuery = { address: new RegExp(region) };
        } else {
          var searchQuery = {
            $and: [{ title: new RegExp(key + '|' + key.replace(/\s/gi, '') + '|' + keyword + '|' + keyword.replace(/\s/gi, '')) },
            { address: new RegExp(region) }]
          }
        }
        // console.log(key + '|' + key.replace(/\s/gi, '') + '|' + keyword + '|' + keyword.replace(/\s/gi, ''))
        // console.log(keyword, region, key)
        // console.log(searchQuery)
        const result = await Place.aggregate([
          { $match: searchQuery },
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
              location: 1,
              imagesUrl: 1,
              reviewCount: { $size: '$reviews' },
              reviewPoint: {
                $cond: { if: { $eq: [{ $avg: '$reviews.point' }, null] }, then: 0, else: { $avg: '$reviews.point' } }
              }
            }
          },
          {
            $sort: { reviewPoint: -1, reviewCount: -1, _id: 1 }
          }, { $skip: page * 6 }, { $limit: 6 }
        ])
        const regionCount = await Place.countDocuments({ address: new RegExp(region) }).exec();

        const placeCount = await Place.countDocuments(searchQuery).exec();

        if (userIdFromJWT) {
          const [wish] = await Wishlist.find({ userId: mongoose.Types.ObjectId(userIdFromJWT) })
          result.forEach(r => {
            r.isWish = false
            for (w of wish.folder) {
              if (w.contents.includes(r._id)) {
                r.isWish = true
                break
              }
            }
          })
        }
        res.status(200).json({
          success: true,
          message: '검색결과',
          data: {
            region: region,
            regionCount: regionCount,
            placeCount: placeCount,
            result: result

          }
        })
      }
    } catch (e) {
      console.log(e)
      res.status(500).json({
        success: false,
        message: e
      })
    }
  }
}