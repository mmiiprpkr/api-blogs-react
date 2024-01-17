const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password, resetpassword, username } = req.body;

    if (password) {
      const CheckUser = await User.findById(id);

      if (!CheckUser) {
        return res.status(403).json({ msg: "User not found" });
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        CheckUser.password
      );

      if (!isPasswordCorrect) {
        return res.status(403).json({ msg: "Incorrect password" });
      }

      if (resetpassword) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(resetpassword, salt);
        req.body.password = hashedPassword;
      } else {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true }
      );
      const updatedPostCount = await Post.updateMany(
        { username: CheckUser.username },
        { $set: { username } }
      );

      const { password: removedPassword, ...others } = updatedUser._doc;
      return res.json({
        others,
        post: updatedPostCount,
        msg: resetpassword
          ? "Update Password Successfully"
          : "Update Successfully",
      });
    } else {
      return res.status(400).json({ msg: "Invalid request" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Username or Email already in use", error });
  }
});

// router.put("/user/:id", async (req, res) => {
//   if (req.body._id === req.params.id) {
//     try {
//       const CheckUser = await User.findById(req.params.id);
//       if (!CheckUser) {
//         return res.status(403).json({ msg: "User not found" });
//       }

//       const CheckPass = await bcrypt.compare(
//         req.body.password,
//         CheckUser.password
//       );
//       if (!CheckPass) {
//         return res.status(403).json({ msg: "Incorect password" });
//       }

//       if (req.body.resetpassword) {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = "";
//         req.body.password = await bcrypt.hash(req.body.resetpassword, salt);
//         try {
//           const UpdateUser = await User.findByIdAndUpdate(
//             req.params.id,
//             {
//               $set: req.body,
//             },
//             {
//               new: true,
//             }
//           );
//           const updatedPostCount = await Post.updateMany(
//             { username: CheckUser.username },
//             { $set: { username: req.body.username } }
//           );
//           console.log(req.body.username);

//           const { password, ...others } = UpdateUser._doc;
//           return res.json({
//             others,
//             update: updatedPostCount,
//             msg: "Update Password Successfully",
//           });
//         } catch (error) {
//           return res
//             .status(404)
//             .json.status({ msg: "Username or Email Already In use" });
//         }
//       } else {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//         try {
//           const UpdateUser = await User.findByIdAndUpdate(
//             req.params.id,
//             {
//               $set: req.body,
//             },
//             {
//               new: true,
//             }
//             );
//             const updatedPostCount = await Post.updateMany(
//               { username: CheckUser.username },
//               { $set: { username: req.body.username } }
//             );
//           console.log(UpdateUser.username);
//           const { password, ...others } = UpdateUser._doc;
//           return res.json({
//             others,
//             post: updatedPostCount,
//             msg: "Update Successfully",
//           });
//         } catch (error) {
//           return res
//             .status(404)
//             .json({ msg: "Username or Email Already In use" });
//         }
//       }
//     } catch (error) {
//       return res.status(404).send({ msg: "Cant update" });
//     }
//   } else {
//     return res.status(404).json({ msg: "You Can Update Only Your Account" });
//   }
// });

router.get("/getuser/:id", async (req, res) => {
  try {
    const userDoc = await User.findById(req.params.id);
    return res.status(200).json(userDoc);
  } catch (error) {
    return res.status(404).json({ msg: "Cant Fetch User" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    await Post.deleteMany({ username: user.username });

    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    return res.status(404).json({ msg: "delete failed please try again" });
  }
});

module.exports = router;
