const Restaurant = require("../../models/restaurant");

module.exports = {
  restaurantCreate: async (req, res) => {
    req.body.category = '식당'
    const restaurant = new Restaurant(req.body);

    try {
      await restaurant.save((err, doc) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err
          });
        }
      });

      res.status(200).json({
        success: true,
        message: "식당 등록 성공",
        data: restaurant
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  restaurantList: async (req, res) => {
    try {
      const restaurants = await Restaurant.find({});

      res.status(200).json({
        success: true,
        message: "식당목록 조회 성공",
        data: restaurants
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  restaurantRead: async (req, res) => {
    const id = req.params.id;

    try {
      const restaurant = await Restaurant.findById(id);

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 식당"
        });
      }

      res.status(200).json({
        success: true,
        message: "식당 조회 성공",
        data:restaurant
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  restaurantUpdate: async (req, res) => {
    const id = req.params.id;

    try {
      // new가 true이면 수정된 문서를 반환
      // runValidators가 true인 경우 업데이트 유효성 검사기를 실행
      const restaurant = await Restaurant.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 식당"
        });
      }

      res.status(200).json({
        success: true,
        message: "정보수정 성공",
        data: restaurant
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
  restaurantDelete: async (req, res) => {
    const id = req.params.id;

    try {
      const restaurant = await Restaurant.findByIdAndDelete(id);

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 식당"
        });      
      }

      res.status(200).json({
        success: true,
        message: "식당삭제 성공"
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
}