const Place = require('../../models/place')

module.exports = {
  search: async (req, res) => {
    try {
      const regions = [
        '서울특별시','서울시','서울',
        '제주도', '제주',
        '인천광역시','인천시', '인천',
        '대전광역시','대전시', '대전',
        '대구광역시','대구시', '대구',
        '울산광역시','울산시', '울산',
        '부산광역시','부산시', '부산',
        '세종시', '세종',
        '속초시','속초',
        '강릉시','강릉',]
      let keyword = req.query.keyword
      let region = ''
      for (r of regions) {
        if (keyword.indexOf(r) !== -1) {
          region = r.substring(0,2)
          keyword = keyword.replace(r,'')
          break
        }
      }

      let key = keyword.replace(/\s/gi, '')
      if (region === '') {
        const searchQuery = { title: new RegExp(key) }
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
              reviewCount: { $size: '$reviews' },
              reviewPoint: { $divide: [{ $avg: '$reviews.point' }, 2] }
            }
          },
          {
            $sort: { reviewPoint: -1 }
          }
        ])
        // const result = await Place.find({ title: new RegExp(key) }).select('_id title category reviewPoint reviewCount address')
        // const temp2 = await Cafe.find({ title: new RegExp(key) }).select('_id title category reviewPoint reviewCount')
        // const temp3 = await Restaurant.find({ title: new RegExp(key) }).select('_id title category reviewPoint reviewCount')
        // const temp4 = await Spot.find({ title: new RegExp(key) }).select('_id title category reviewPoint reviewCount')

        // const result = [
        //   ...temp1,
        //   ...temp2,
        //   ...temp3,
        //   ...temp4,
        // ]
        res.status(200).json({
          success: true,
          message: '검색결과',
          data: result
        })
      } else {
        // console.log(key)
        // console.log(key + '|' + key.substring(key.indexOf(region) + region.length))
        const searchQuery = {
          $and: [{ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) },
          { address: new RegExp(region) }]
        }
        // {
        //   title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)),
        //   'address[0]': new RegExp(region),

        // }
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
              reviewCount: { $size: '$reviews' },
              reviewPoint: { $divide: [{ $avg: '$reviews.point' }, 2] }
            }
          },
          {
            $sort: { reviewPoint: -1 }
          }
        ])
        // const dupResult = await Place.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category reviewPoint reviewCount address')
        // const temp2 = await Cafe.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category reviewPoint reviewCount address')
        // const temp3 = await Restaurant.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category reviewPoint reviewCount address')
        // const temp4 = await Spot.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category reviewPoint reviewCount address')

        // const dupResult = [
        //   ...temp1,
        //   ...temp2,
        //   ...temp3,
        //   ...temp4,
        // ]
        // const set = new Set(dupResult)

        // const result = new Array(...set)
        // const result = dupResult
        result.sort((a, b) => {
          return b.reviewPoint - a.reviewPoint
        })

        result.sort((a, b) => {
          if ((a.address[0].indexOf(region) != -1 || a.address[1].indexOf(region) != -1) && (b.address[0].indexOf(region) == -1 && b.address[1].indexOf(region) == -1)) { return -1; }
          else if ((a.address[0].indexOf(region) == -1 && a.address[1].indexOf(region) == -1) && (b.address[0].indexOf(region) != -1 || b.address[1].indexOf(region) != -1)) { return 1; }
          else { return 0; }
        })

        res.status(200).json({
          success: true,
          message: '검색결과',
          data: result
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

