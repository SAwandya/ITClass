const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalide email or password");

  const validePassword = await bcrypt.compare(req.body.password, user.password);
  if (!validePassword)
    return res.status(400).send("Invalide email or password");

  const token = jwt.sign(
    { _id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_PRIVATE_KEY
  );

  res.send(token);
});

module.exports = router;
