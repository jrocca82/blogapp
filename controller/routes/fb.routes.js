const Router = require("express").Router(),
	fbAuth = require("../auth/fb.passport.js"),
	passport = require("passport");

Router.get(
	"/",
	passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

Router.get("/redirect", passport.authenticate("facebook"), (req, res) => {
	res.redirect("/dashboard");
});

module.exports = Router;
