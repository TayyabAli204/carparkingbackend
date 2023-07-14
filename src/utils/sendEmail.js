
var nodemailer = require("nodemailer");
const {emailCollection} = require("../models/emailModel");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tayyabali7619@gmail.com",
    pass: "zbxnkolbhxnpongc",
  },
});

const sendEmail = async (userEmail,token) => {
  try {
    var mailOptions = {
      from: "tayyabali7619@gmail.com",
      to: userEmail,
      subject: "subject",
      text: token,
    };

    await transporter.sendMail(mailOptions);
    const emails = new emailCollection({
      email: userEmail,
      text: token,
    });
    const results = await emails.save();
  } catch (error) {
  }
};

module.exports = sendEmail;
