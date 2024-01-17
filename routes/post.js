const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.post("/create", async (req, res) => {
  try {
    const savedPost = await Post.create(req.body);
    return res.status(200).json({ msg: "Create Post Successfully", savedPost });
  } catch (err) {
    return res.status(500).json({ msg: "Cant Create Post", err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username == req.body.username) {
      const UpdatePost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).json({
        UpdatePost,
        msg: "Update post successfully",
        post: UpdatePost,
      });
    } else {
      return res.status(404).json({ msg: "You cant update only your posts" });
    }
  } catch (error) {
    return res.status(404).json({ msg: "Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json("Post not found!");
    }
    try {
      await Post.deleteOne({ _id: req.params.id });
      res.status(200).json("Post has been deleted...");
    } catch (err) {
      res.status(500).json("Can't delete the post");
    }
  } catch (err) {
    res.status(500).json("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });

    return res.json({ msg: "fetch posts", post });
  } catch (err) {
    return res.status(500).json({ msg: "error fetching posts" });
  }
});

router.get("/all/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ msg: "fetching success", posts });
  } catch (error) {
    console.error(error); // แสดงข้อผิดพลาดใน console เพื่อดูข้อผิดพลาดที่เกิดขึ้น
    return res
      .status(500)
      .json({ msg: "Error fetching posts", error: error.message }); // ส่งข้อความข้อผิดพลาดกลับไปใน response
  }
});

module.exports = router;
