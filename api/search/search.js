const Place = require('../../models/place')

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
        const result = await Place.find({ title: new RegExp(key) }).select('_id title category reviewPoint reviewCount address')
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
          success:true,
          message:'검색결과',
          data: result
        })
      } else {
        // console.log(key)
        // console.log(key + '|' + key.substring(key.indexOf(region) + region.length))
        const dupResult = await Place.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category reviewPoint reviewCount address')
        // const temp2 = await Cafe.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category reviewPoint reviewCount address')
        // const temp3 = await Restaurant.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category reviewPoint reviewCount address')
        // const temp4 = await Spot.find({ title: new RegExp(key + '|' + key.substring(key.indexOf(region) + region.length)) }).select('_id title category reviewPoint reviewCount address')
        
        // const dupResult = [
        //   ...temp1,
        //   ...temp2,
        //   ...temp3,
        //   ...temp4,
        // ]
        const set = new Set(dupResult)

        const result = new Array(...set)
        result.sort((a, b) => {
          return b.reviewPoint-a.reviewPoint 
        })

        result.sort((a, b) => {
          if ((a.address[0].indexOf(region) != -1 || a.address[1].indexOf(region) != -1) && (b.address[0].indexOf(region) == -1 && b.address[1].indexOf(region) == -1)) { return -1; }
          else if ((a.address[0].indexOf(region) == -1 && a.address[1].indexOf(region) == -1) && (b.address[0].indexOf(region) != -1 || b.address[1].indexOf(region) != -1)) { return 1; }
          else { return 0; }
        })

        res.status(200).json({
          success:true,
          message:'검색결과',
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

