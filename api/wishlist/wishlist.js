const mongoose = require("mongoose");
const { findOneAndUpdate } = require("../../models/wishlist");
const Wishlist = require("../../models/wishlist");

module.exports = {
  folderCreate: async (req, res) => {
    try {
      // const user_id = req.body.user_id
      // console.log(user_id)
      const wishlist = await Wishlist.findOneAndUpdate(
        { user_id: req.body.user_id },
        { $push: { folder: { $each: [req.body.folder], $position: 0 } } },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: "게시물 업로드 성공",
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
  folderList: async (req, res) => {
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
  folderRead: async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ user_id: req.params.user_id });

      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 게시물"
        });
      }

      res.status(200).json({
        success: true,
        message: "게시물 조회 성공",
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
      // new가 true이면 수정된 문서를 반환
      // runValidators가 true인 경우 업데이트 유효성 검사기를 실행
      const wishlist = await Wishlist.findOneAndUpdate(
        { user_id: req.params.user_id, "folder._id": req.query.folder_id },
        { $set: { "folder.$.name": req.body.name, "folder.$.start_date": req.body.start_date, "folder.$.end_date": req.body.end_date } },
        { new: true, runValidators: true, }
      );

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
        error: e
      });
    }
  },
  folderDelete: async (req, res) => {
    try {
      const wishlist = await Wishlist.findOneAndUpdate(
        { user_id: req.params.user_id },
        { $pull: { folder: { _id: req.query.folder_id } } },
        { new: true }
      );

      if (!wishlist) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 게시물"
        });
      }

      if (!wishlist.image_id) {
        return res.status(200).json({
          success: true,
          message: "게시물 삭제 성공",
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
      const { user_id, place_id, folder_id } = req.body;
      const wishlist = await Wishlist.findOneAndUpdate(
        { user_id: user_id, 'folder._id': folder_id },
        { $push: { 'folder.$.contents': { $each: [place_id], $position: 0 }, total: { $each: [place_id], $position: 0 } } },
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
      const { place_id, folder_id } = req.query;
      const user_id = req.params.user_id;
      const wishlist = await Wishlist.findOneAndUpdate(
        { user_id: user_id, 'folder._id': folder_id },
        { $pull: { 'folder.$.contents': place_id, total: place_id } },
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
      const user_id = req.params.user_id;
      const folder_id = req.query.folder_id;

      const folder = await Wishlist.findOne({ user_id: user_id, 'folder._id': folder_id }, { 'folder.$': 1 }).populate('folder.contents')

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