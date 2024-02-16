//controllers/home_controller.js
module.exports.entryPage = function (req, res) {
  return res.render("users_profile", {
    title: "home",
  });
};
