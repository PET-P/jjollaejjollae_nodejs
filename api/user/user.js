const User = require("../../models/user");
const Wishlist = require("../../models/wishlist");
const { sign, refresh } = require('../../middleware/jwt');

module.exports = {
  userCreate: async (req, res) => {
    req.body.accountType = 'local';
    const user = new User(req.body);
 

    try {
      await user.save(async(err, doc) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            success: false,
            error: err
          });
        }
        else{
          const wish = new Wishlist({userId: user._id});
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
      const users = await User.find({});

      res.status(200).json({
        success: true,
        message: "회원목록 조회 성공",
        data: users
      });  //권한확인필요
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  userRead: async (req, res) => {
    const id = req.params.id;

    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 회원"
        });
      }

      res.status(200).json({
        success: true,
        message: "회원 조회 성공",
        data:user
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  // 비밀번호 변경시 암호처리 필요
  userUpdate: async (req, res) => {
    const id = req.params.id;

    try {
      // new가 true이면 수정된 문서를 반환
      // runValidators가 true인 경우 업데이트 유효성 검사기를 실행
      const user = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 회원"
        });
      }

      res.status(200).json({
        success: true,
        message: "정보수정 성공",
        data: user
      });
    } catch (e) {
      console.log(e)
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
  userDelete: async (req, res) => {
    const id = req.params.id;

    try {
      const user = await User.findByIdAndDelete(id);

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
        error:e
      });
    }
  },
}