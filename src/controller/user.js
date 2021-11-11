const User = require("../models/user");

const jwt = require("jsonwebtoken");

const generateJwtToken = (_id, role) => {
  console.log(`Server is running on port ${process.env.JWT_SECRET}`);
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.signup = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  User.findOne({ email: req.body.email }).exec((error, user) => {
    if (user)
      return res.status(400).json({
        success: "false",
        message: "User already registered with these credentials",
      });

    const { firstName, lastName, email, password, favorites } = req.body;

    const _user = new User({
      firstName,
      lastName,
      email,
      favorites,
      password,
      username: Math.random().toString(),
    });

    _user.save((error, data) => {
      if (data) {
        return res.status(201).json({
          success: "true",
          user: data,
        });
      }
      if (error) {
        console.log(error);
        return res.status(400).json({
          success: "false",
          message: "Please try again",
        });
      }
    });
  });
};

exports.addToFavs = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const f = req.body.newFav;
  User.findOneAndUpdate({"email":req.body.email},
    {
      $addToSet: {
        "favorites" : req.body.newFav,
      },
    }
  ).exec((error, user) => {
    if (user) {
      // return res.status(400).json({
      //   success:"true",
      //   message: "liked photo : "+  ,
      // });
      user.save((error, data) => {
        if (data) {
          return res.status(201).json({
            success: "true",
            message: "liked photo : " + req.body.newFav,
          });
        }
        if (error) {
          console.log(error);
          return res.status(400).json({
            err: error,
            success: "false",
            message: "Please try again",
          });
        }
      });
    }
  });
};

exports.signin = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error)
      return res.status(200).json({
        success: "false",
        message: "Please try again",
      });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "user") {
        const token = generateJwtToken(user._id, user.role);
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.status(200).json({
          success: "true",
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(200).json({
          success: "false",
          message: "Wrong ID or Password. Try Again..",
        });
      }
    } else {
      return res
        .status(200)
        .json({ message: "Wrong ID or Password. Try Again.." });
    }
  });
};
exports.profile = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  User.findOne({ _id: req.body.id }).exec(async (error, user) => {
    console.log(req.body.id);
    if (error)
      return res.status(200).json({
        success: "false",
        message: "Please try again",
      });
    if (user) {
      const { _id, firstName, lastName, email, role, fullName } = user;
      res.status(200).json({
        success: "true",
        user: { _id, firstName, lastName, email, role, fullName },
      });
    } else {
      return res
        .status(400)
        .json({ success: "false", message: "Wrong Credentials" });
    }
  });
};

exports.getProfile = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error)
      return res.status(200).json({
        success: "false",
        message: "Please try again",
      });
    if (user) {
      const { _id, firstName, lastName, email, role, fullName, favorites } =
        user;
      res.status(200).json({
        success: "true",
        user: { _id, firstName, lastName, email, role, fullName, favorites },
      });
    } else {
      return res.status(200).json({
        success: "false",
        message: "Wrong ID or Password. Try Again..",
      });
    }
  });
};
