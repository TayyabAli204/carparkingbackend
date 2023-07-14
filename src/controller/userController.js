const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const usersCollection = require("../models/userModel");
const { tokenCollection } = require("../models/emailModel");
const { emailCollection } = require("../models/emailModel");

const saltRounds = 10;
const doSignUp = async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

    const token = await jwt.sign(
      {
        email: req.body.email,
      },
      "Secret"
    );
    const user = new usersCollection({
      email: req.body.email,
      passwordHash: passwordHash,
    });

    const result = await user.save();

    return res.status(200).json({
      message: "user is sucessfully resgistered!",
      data: {
        email: req.body.email,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed",
      error: error,
      data: [],
    });
  }
};

const doLogin = async (req, res) => {
  try {
    const userData = await usersCollection.findOne({
      email: req.body.email,
    });
    if (!userData.email) {
      return res.status(501).json({
        message: "email is not found",
        data: [],
      });
    }
    const passwordDecode = await bcrypt.compare(
      req.body.password,
      userData.passwordHash
    );
    if (!passwordDecode) {
      return res.status(502).json({
        message: "wrong password",
      });
    }

    const token = await jwt.sign(
      {
        email: userData.email,
      },
      "Secret"
    );
    return res.status(200).json({
      message: "user is sucessfully resgistered!",
      data: {
        email: req.body.email,
        token: token,
        name:userData.name
      },
    });
  } catch (error) {
    return res.status(600).json({
      message: "failed",
      error: error,
    });
  }
};

//  email wala routes
const generateToken = () => {
  const min = 1000;
  const max = 9999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};

const doSendEmail = async (req, resp) => {
  try {
    const useremail = req.body.email;
    const existingUser = await usersCollection.findOne({ email: useremail });
    if (existingUser) {
      resp.json({ error: "Email already exists" });
      return;
    }
    const token = generateToken();
    const email = await sendEmail(req.body.email, token.toString());
    return resp.status(200).json({
      message: "Verification code sent successfully ",
      data: {
        email: req.body.email,
        token: token,
      },
    });
  } catch (error) {
    resp.status(502).json({
      message: "failed",
      error: error,
      data: [],
    });
  }
};
//  send token routes
const doFindToken = async (req, resp) => {
  try {
    const posts = await tokenCollection.find({ email: req.body.email });
    if (posts[0]._doc.text === req.body.token) {
      resp.status(200).json({
        massage: "OK",
      });
    } else {
      resp.json({
        massage: "worng OTP",
        data: [],
      });
    }
  } catch (error) {
  }
};

const doSendPassword = async (res, resp) => {
  try {
    const userPassword = await emailCollection.updateOne(
      { email: res.body.email },
      { $set: { password: res.body.password } }
    );
  
    resp.status(200).json({
      massage: "password are add to emailCollection",
    });
  } catch (error) {
  }
};

const updateProfile = async (req, res) => {
  try {
    const userLogin = await usersCollection.findOne({
      email: req.body.oldEmail.email,
    });
  
    const updated = await usersCollection.updateOne(
      { email: userLogin.email },
      { $set: { email: req.body.newEmail, name: req.body.newName } }
    );

    res.status(200).json({
      message: "updated ",
      data: {
        email: req.body.newEmail,
      },
    });
  } catch (error) {
    res.status(401).send("something went wrong");
  }
};

const newPassword = async (req, res) => {
  try {
      const userLogin = await usersCollection.findOne({
        email: req.body.email,
      });
      const camparison = await bcrypt.compare(
        req.body.currentPassword,
        userLogin.passwordHash
      );
      if (!camparison) {
        return res.status(401).json({
          message: "incorrect password",
          data: {
            // name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          },
        });
      } else {
        const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
        const userLogin = await usersCollection.updateOne(
          { email: req.body.email },
          { $set: { passwordHash: hashPassword } }
        );
        res.status(200).json("success updated");
      }
    // }
  } catch (error) {
    res.status(401).json("not updated");
  }
};

module.exports = {
  doSignUp,
  doLogin,
  doSendEmail,
  doFindToken,
  doSendPassword,
  updateProfile,
  newPassword,
};
