const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res.status(404).json({ msg: "Email already exists" });
    }

    const existsUsername = await User.findOne({ username });
    if (existsUsername) {
      return res.status(404).json({ msg: "Username already exists" });
    }

    const hashPass = await bcrypt.hash(password, 13);

    const userDoc = await User.create({
      username,
      email,
      password: hashPass,
    });
    return res.status(200).json({ msg: "Register Success", userDoc });
  } catch (error) {
    console.log("Register Failed");
    return res.status(404).send({ msg: "Register Failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username } = req.body;
    const CheckUser = await User.findOne({ username });
    if (!CheckUser) {
      return res.status(403).json({ msg: "User not found" });
    }

    const CheckPass = await bcrypt.compare(
      req.body.password,
      CheckUser.password
    );
    if (!CheckPass) {
      return res.status(403).json({ msg: "Incorect password" });
    }

    const { password, ...others } = CheckUser._doc;
    res.status(200).json(others);
  } catch (error) {
    return res.status(404).send({ msg: "login failed , please try again" });
  }
});

module.exports = router;
