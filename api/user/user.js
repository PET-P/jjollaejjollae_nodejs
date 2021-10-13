const User = require("../../models/user");
const Wishlist = require("../../models/wishlist");
const mongoose = require('mongoose');
const { sign, refresh } = require('../../middleware/jwt');

module.exports = {
  userCreate: async (req, res) => {
    req.body.accountType = 'local';
    const user = new User(req.body);
    try {
      await user.save(async (err, doc) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            success: false,
            error: err
          });
        }
        else {
          const wish = new Wishlist({ userId: user._id });
          await wish.save();
          let accessToken = sign(user);
          let refreshToken = refresh(user.email);

          return res.status(200).json({
            success: true,
            message: "회원가입 성공",
            data: {
              _id: user._id,
              accessToken: accessToken,
              refreshToken: refreshToken
            }
          });
        }
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  userList: async (req, res) => {
    try {
      const users = await User.find({}).select('_id admin accountType email nick repPetId pets').lean();

      res.status(200).json({
        success: true,
        message: "회원목록 조회 성공",
        data: users
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  userRead: async (req, res) => {
    try {
      const userId = req.params.userId;

      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })
      const user = await User.findById(userId).select('_id admin accountType email nick repPetId pets').lean();

      user.pets.forEach(pet => {
        delete pet.createdAt
        delete pet.updatedAt
      })

      console.log(user.pets[user.pets.length - 1])

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 회원"
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "회원 조회 성공",
          data: user
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  userUpdate: async (req, res) => {
    try {
      const userId = req.params.userId;

      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const user = await User.findByIdAndUpdate(userId, req.body, {
        new: true
      }).select('_id admin accountType email nick pets').lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 회원"
        });
      } else {
        const result = {};
        for (key in req.body) {
          result[key] = req.body[key]
        }
        return res.status(200).json({
          success: true,
          message: "정보수정 성공",
          data: result
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
  userDelete: async (req, res) => {
    try {
      const userId = req.params.userId;

      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 회원"
        });
      }
      res.status(200).json({
        success: true,
        message: "회원탈퇴 성공"
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  petRead: async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const petResult = await User.findById(userId).select('pets').lean()

      petResult.pets.forEach(pet => {
        delete pet.createdAt
        delete pet.updatedAt
      })

      res.status(200).json({
        success: true,
        message: "반려동물 조회 성공",
        data: petResult.pets
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e.message
      });
    }

  },
  petCreate: async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })
      const user = await User.findById(userId).select('_id admin accountType email nick repPetId pets').lean();


      const petCreateResult = await User.findOneAndUpdate({ _id: userId }, { $push: { pets: req.body } }, { new: true })

      let data = JSON.parse(JSON.stringify(petCreateResult.pets[petCreateResult.pets.length - 1]))
      delete data.createdAt
      delete data.updatedAt

      res.status(200).json({
        success: true,
        message: "반려동물 등록 성공",
        data: data
      });

    } catch (e) {
      res.status(500).json({
        success: false,
        error: e.message
      });
    }

  },
  petUpdate: async (req, res) => {
    try {
      const { userId, petId } = req.params;
      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })
      const user = await User.findById(userId).select('_id admin accountType email nick repPetId pets').lean();

      var update = {};

      for (key in req.body) {
        update['pets.$.' + key] = req.body[key]
      }
      const petUpdateResult = await User.findOneAndUpdate(
        { _id: userId, 'pets._id': petId },
        { $set: update }, { new: true });

      res.status(200).json({
        success: true,
        message: "반려동물 수정 성공",
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e.message
      });
    }

  },
  petDelete: async (req, res) => {
    try {
      const { userId, petId } = req.params;
      if (!userId)
        return res.status(400).json({ success: false, message: "userId 없음" })
      if (userId != req.userId)
        return res.status(400).json({ success: false, message: "토큰 유효성 없음" })

      const result = await User.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(userId) },
        { $pull: { pets: { _id: mongoose.Types.ObjectId(petId) } } },
        { new: false }
      ).select('-pets.createdAt -pets.updatedAt')
      if (result.pets.length == 1) {
        return res.status(200).json({
          success: true,
          message: "반려동물 삭제 성공",
          data: []
        });
      }

      for (i in result.pets) {
        if (String(result.pets[i]._id) == petId && result.pets[i].isRepresent) {
          const representResult = await User.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(userId) },
            { $set: { 'pets.0.isRepresent': true } },
            { new: true }
          ).select('-pets.createdAt -pets.updatedAt')

          return res.status(200).json({
            success: true,
            message: "반려동물 삭제 성공",
            data: representResult.pets
          });
        } else if (String(result.pets[i]._id) == petId && !result.pets[i].isRepresent) {
          result.pets.splice(i, 1);

          console.log(result)
          return res.status(200).json({
            success: true,
            message: "반려동물 삭제 성공",
            data: result.pets
          });
        }
      }
      return res.status(404).json({
        success: false,
        message: "반려동물 id를 확인해주세요.",
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e.message
      });
    }

  },
}