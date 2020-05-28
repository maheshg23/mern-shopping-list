const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

const JWT_SECRET = config.get("jwtSecret");

console.log;
const Item = require("../../models/User");

//* @route POST api/auth
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (user) throw Error("User already exists");

    const salt = await bcrypt.genSalt(10);
    if (!salt) throw Error("Something went wrong with bcrypt");

    const hash = await bcrypt.hash(password, salt);
    if (!hash) throw Error("Something went wrong hashing the password");

    const newUser = new User({
      name,
      email,
      password: hash,
    });

    const savedUser = await newUser.save();
    if (!savedUser) throw Error("Something went wrong saving the user");

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: 3600,
    });

    res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// //* @route POST api/login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   // Simple validation
//   if (!email || !password) {
//     return res.status(400).json({ msg: "Please enter all fields" });
//   }

//   try {
//     // Check for existing user
//     const user = await User.findOne({ email });
//     if (!user) throw Error("User Does not exist");

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) throw Error("Invalid credentials");

//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
//     if (!token) throw Error("Couldnt sign the token");

//     res.status(200).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (e) {
//     res.status(400).json({ msg: e.message });
//   }
// });

//* @route GET api/auth/user
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user));
});

module.exports = router;
