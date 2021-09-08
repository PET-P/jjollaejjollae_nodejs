const Accomm = require('../../models/accomm')
const Cafe = require('../../models/cafe')
const Restaurant = require('../../models/restaurant')
const Spot = require('../../models/spot')

module.exports = {
  search: async (req, res) => {
    try {
      const regions = ['서울', '인천', '대전', '대구', '울산', '부산', '제주', '세종']
      let keyword = req.query.keyword
      let region = ''
      for (r of regions) {
        if (keyword.indexOf(r) !== -1) {
          region = r
          break
        }
      }
      
      let key = keyword.replace(/\s/gi, '')

      if (region === '') {
        const temp1 = await Accomm.find({ title: new RegExp(key) }).select('_id title category review_point review_count')
        const temp2 = await Cafe.find({ title: new RegExp(key) }).select('_id title category review_point review_count')
        const temp3 = await Restaurant.find({ title: new RegExp(key) }).select('_id title category review_point review_count')
        const temp4 = await Spot.find({ title: new RegExp(key) }).select('_id title category review_point review_count')

        const result = [
          ...temp1,
          ...temp2,
          ...temp3,
          ...temp4,
        ]
        res.status(200).json({
          data: result
        })
      } else {
        console.log(key)
        console.log(key + '|' + key.substring(key.indexOf(region) + region.length))
        const temp1 = await Accomm.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category review_point review_count address')
        const temp2 = await Cafe.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category review_point review_count address')
        const temp3 = await Restaurant.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category review_point review_count address')
        const temp4 = await Spot.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category review_point review_count address')
        
        const dup_result = [
          ...temp1,
          ...temp2,
          ...temp3,
          ...temp4,
        ]
        const set = new Set(dup_result)

        const result = new Array(...set)
        result.sort((a, b) => {
          return b.review_point-a.review_point 
        })

        result.sort((a, b) => {
          if ((a.address[0].indexOf(region) != -1 || a.address[1].indexOf(region) != -1) && (b.address[0].indexOf(region) == -1 && b.address[1].indexOf(region) == -1)) { return -1; }
          else if ((a.address[0].indexOf(region) == -1 && a.address[1].indexOf(region) == -1) && (b.address[0].indexOf(region) != -1 || b.address[1].indexOf(region) != -1)) { return 1; }
          else { return 0; }
        })

        res.status(200).json({
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

