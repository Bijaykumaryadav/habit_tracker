//controllers/home_controller.js
module.exports.entryPage = function (req, res) {
  return res.render("entry_page", {
    title: "home",
  });
};
