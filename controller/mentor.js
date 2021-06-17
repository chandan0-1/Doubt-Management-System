let User = require("../models/user");
const Doubt = require("../models/doubt");



// Rendering the Mentor Homepage
module.exports.home = async function (req, res) {
  let doubt = await Doubt.find({}).sort("-createdAt").populate("student");
  if (doubt) {
    return res.render("mentor_home", {
      title: "Home",
      doubt,
    });
  }
};


module.exports.activeDoubtsDummy = function (req, res) {
  return res.render("mentor_active_doubts", {
    title: "Active Doubts",
  });
};


// -------------Rendering the Dashboard Section of mentor----------
module.exports.dashboard = async function (req, res) {
  let doubt = await Doubt.find({});
  let user = await User.find({});

  var temp = 0;
  var resolved = 0;
  for (doubt of doubt) {
    temp++;
    if (doubt.status == "resolved") {
      resolved++;
    }
  }

  if (req.isAuthenticated()) {
    return res.render("mentor_dashboard", {
      title: "Mentor Dashboard",
      temp: temp,
      resolved,
      users :user,
    });
  }
};

// -------------Rendering the Dashboard Section of mentor----------
module.exports.activeDoubts = function (req, res) {
  
  Doubt.findById(req.params.id)
    .populate("student")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .exec(function (err, doubt) {
      return res.render("active_doubts", {
        title: "Active Doubts",
        doubt: doubt,
      });
    });

};

module.exports.createAns = async function (req, res) {
  req.flash("success", "Doubt Resolved Successfully !!");

  try {
    let doubt = await Doubt.findByIdAndUpdate(req.body.doubtID, {
      answer: req.body.content,
      status: "resolved",
      mentor: req.user.id,
    });

    User.findById(req.user._id, function (err, user) {
      user.doubt.push(req.body.doubtID);
      user.save();
    });

    return res.redirect("/mentor/home");
  } catch (err) {
    return res.json({
      status: 501,
      message: "Internal Server Error",
    });
  }
};


// -----------------------------------------------------------------
// creating data for Esclated Doubt
module.exports.esclateDoubt = async function (req, res) {
  try {

        req.flash("error", "Doubt Esclated !!");

    User.findById(req.user._id, function (err, user) {
      user.esclateDoubt.push(req.body.doubtID);
      user.save();
    });

    return res.redirect("/mentor/home");
  } catch (err) {
    return res.json({
      status: 501,
      message: "Internal Server Error",
    });
  }
};


module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully!");
  return res.redirect("/mentor/home");
};

module.exports.destroySession = function (req, res) {
  req.logout();
  req.flash("success", "You have Logged out!");

  return res.redirect("/");
};

