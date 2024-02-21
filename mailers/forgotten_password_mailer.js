const nodemailer = require("../config/nodemailer");
const crypto = require("crypto");

// Generate a token
const token = crypto.randomBytes(20).toString("hex");

module.exports.forgottenPassword = function (userEmail) {
  let htmlString = nodemailer.renderTemplate(
    { userEmail: userEmail, token: token },
    "/password/forgotten_password_mailer.ejs"
  );
  nodemailer.transporter.sendMail(
    {
      from: "ybijayyadav468@gmail.com",
      to: userEmail,
      subject: "Reset your password",
      html: htmlString,
    },
    function (err, info) {
      if (err) {
        console.log("Error on sending reset password link", err);
      } else {
        console.log("Reset link sent!", info);
      }
    }
  );
};
