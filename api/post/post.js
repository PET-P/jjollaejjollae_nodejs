const Post = require("../../models/post");
const PostImage = require("../../models/post_image");

module.exports = {
  postCreate: async (req, res) => {
    try{
      const img = req.file.buffer;
      if(img.truncated) return res.status(413);

      const image = await PostImage.create({image:img})
      await image.save();
      req.body.image_id = image._id
    } catch (e) {
      return res.status(500);
    }
    const post = new Post(req.body);
    
    try {
      await post.save((err, doc) => {
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
        data: post
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  postList: async (req, res) => {
    try {
      const posts = await Post.find({});

      res.status(200).json({
        success: true,
        message: "게시물 조회 성공",
        data: posts
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    }
  },
  postRead: async (req, res) => {
    const id = req.params.id;

    try {
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 게시물"
        });
      }

      res.status(200).json({
        success: true,
        message: "게시물 조회 성공",
        data:post
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error: e
      });
    } 
  },
  postUpdate: async (req, res) => {
    const id = req.params.id;

    try {
      // new가 true이면 수정된 문서를 반환
      // runValidators가 true인 경우 업데이트 유효성 검사기를 실행
      const post = await Post.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 게시물"
        });
      }

      res.status(200).json({
        success: true,
        message: "게시물 수정 성공",
        data: post
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
  postDelete: async (req, res) => {
    const id = req.params.id;

    try {
      const post = await Post.findByIdAndDelete(id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "존재하지 않는 게시물"
        });      
      }
      if (!post.image_id){
        await PostImage.deleteOne(post.image_id);
      }

      res.status(200).json({
        success: true,
        message: "게시물 삭제 성공"
      });
    } catch (e) {
      res.status(500).json({
        success: false,
        error:e
      });
    }
  },
}