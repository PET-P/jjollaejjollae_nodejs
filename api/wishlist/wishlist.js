const mongoose = require("mongoose");
const { findOneAndUpdate } = require("../../models/wishlist");
const Wishlist = require("../../models/wishlist");

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

      const wishlist = await Wishlist.findOne({ userId: userId });

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
      const { userId, placeId, folderId, region } = req.body;

      const userId = req.params.userId
      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const wishlist = await Wishlist.findOneAndUpdate(
        { userId: userId, 'folder._id': folderId },
        { $push: { 'folder.$.contents': { $each: [placeId], $position: 0 }, total: { $each: [placeId], $position: 0 }, 'folder.$.regions': { $each: [region], $position: 0 } } },
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

      const userId = req.params.userId
      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const wishlist = await Wishlist.findOneAndUpdate(
        { userId: userId, 'folder._id': folderId },
        { $pull: { 'folder.$.contents': placeId, total: placeId } },
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

      const userId = req.params.userId
      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const folder = await Wishlist.findOne({ userId: userId, 'folder._id': folderId }, { 'folder.$': 1 }).populate('folder.contents')

      if (!folder) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 유저 혹은 폴더"
        });
      } else {
        return res.status(200).json({
          success: true,
          message: '정상적으로 조회되었습니다.',
          data: folder
        })
      }
    } catch (e) {
      console.log(e)
      return res.status(500).json({
        success: false,
        error: e
      });
    }
  }

}