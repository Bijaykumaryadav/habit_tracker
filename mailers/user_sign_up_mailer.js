const nodemailer = require("../config/nodemailer");
const crypto = require("crypto");
const generateToken = () => {
  let token = crypto.randomBytes(20).toString("hex");
  return token;
};
module.exports.signUp = function (user) {
  let htmlString = nodemailer.renderTemplate(
    { user: user, token: generateToken() },
    "/sign_up/sign_up_mailer.ejs"
  );
  nodemailer.transporter.sendMail(
    {
      from: "ybijayyadav468@gmail.com",
      to: user.email,
      subject: "Leading To Wealthy Life",
      html: htmlString,
    },
    function (err, info) {
      if (err) {
        console.log("Error in sending Email", err);
      }
      console.log("message sent", info);
    }
  );
};
