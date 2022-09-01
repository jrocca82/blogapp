const Router = require("express").Router(),
User = "../../model/user.model.js";

Router.post("/follower/new", (req, res) => {
    if(req.session.user || req.user) {
        let user = req.session.user || req.user;

        User.findOne({ username: user.username }).then((usr) => {
            usr.people_you_are_following.push(req.body.username);
            usr.save();
        })
    } else {
        res.redirect("/");
    }
});

module.exports = Router;