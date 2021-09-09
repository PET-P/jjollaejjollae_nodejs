const Wishlist = require("../../models/wishlist");

module.exports = {
  wishlistCreate: async (req, res) => {
    const wishlist = new Wishlist(req.body);
    try {
      await wishlist.save((err, doc) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err
          });
        }
      });

      res.status(200).json({
        success: true,
        message: "게시물 업로드 성공",
        data: wishlist
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  wishlistList: async (req, res) => {
    try {
      const wishlists = await Wishlist.find({});

      res.status(200).json({
        success: true,
        message: "게시물 조회 성공",
        data: wishlists
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  wishlistRead: async (req, res) => {
    const id = req.params.id;

    try {
      const wishlist = await Wishlist.findById(id);

      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 게시물"
        });
      }

      res.status(200).json({
        success: true,
        message: "게시물 조회 성공",
        data:wishlist
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    } 
  },
  wishlistUpdate: async (req, res) => {
    const id = req.params.id;

    try {
      // new가 true이면 수정된 문서를 반환
      // runValidators가 true인 경우 업데이트 유효성 검사기를 실행
      const wishlist = await Wishlist.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 게시물"
        });
      }

      res.status(200).json({
        success: true,
        message: "게시물 수정 성공",
        data: wishlist
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
  wishlistDelete: async (req, res) => {
    const id = req.params.id;

    try {
      const wishlist = await Wishlist.findByIdAndDelete(id);

      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 게시물"
        });      
      }

      if (!wishlist.image_id){
        return res.status(200).json({
          success: true,
          message: "게시물 삭제 성공"
        });
      }

    } catch (e) {
      return res.status(500).json({
        success: false,
        error:e
      });
    }
  },
}