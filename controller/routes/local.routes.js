const Router = require("express").Router(),
	User = require("../../model/user.model"),
	bcrypt = require("bcryptjs"),
	key = require("../../key");
sgMail = require("@sendgrid/mail");

sgMail.setApiKey(key.sendGrid.apiKey);

Router.post("/signup", (req, res) => {
	let errors = [];
	let usernameAlreadyChosen = false;
	let usernameIsGood = req.body.username.length > 0;
	let passwordIsGood = req.body.password.length > 0;
	let emailIsGood = req.body.email.length > 0;
	if (!usernameIsGood) errors.push("Please choose a username");
	if (!passwordIsGood) errors.push("Please choose a password");
	if (!emailIsGood) errors.push("Please enter your email");

	User.findOne({ username: req.body.username })
		.then((user) => {
			if (user) {
				usernameAlreadyChosen = true;
				errors.push("This username is taken");
			} else {
				usernameAlreadyChosen = false;
			}
		})
		.then(() => {
			if (errors.length > 0) {
				res.render("signup", { errors });
			} else {
				let newuser = new User();
				const salt = bcrypt.genSaltSync(10);
				newuser.username = req.body.username;
				newuser.password = bcrypt.hashSync(req.body.password, salt);
				newuser.email = req.body.email;
				newuser.profile_pic = req.body.profile_pic;
				newuser.followers.push(req.body.username);
				newuser.people_you_are_following.push(req.body.username);
				newuser.save((user) => {
						req.session.user = user;
						res.redirect("/dashboard");
					}).then(() => {
						let email = {
							from: key.sendGrid.username,
							to: newuser.email,
							subject: "Welcome to Node Blogger",
							html: "<h2>Welcome to Node Blogger!</h2><br/><p>Thank you for signing up.</p>",
						};

						sgMail
							.send(email)
							.then(() => {
								console.log("Email sent");
							})
							.catch((error) => {
								console.error(error);
							});
					});
			}
		});
});

Router.post("/login", (req, res) => {
	let errors = [];
	let usernameIsGood = req.body.username.length > 0;
	let passwordIsGood = req.body.password.length > 0;
	if (!usernameIsGood) errors.push("Please enter your username");
	if (!passwordIsGood) errors.push("Please enter your password");

	User.findOne({ username: req.body.username }).then((user) => {
		if (user && bcrypt.compareSync(req.body.password, user.password) === true) {
			req.session.user = user;
			res.redirect("/dashboard");
		} else {
			errors.push("Could not log in. Please check your username and password.");
			res.render("login", { errors });
		}
	});
});

module.exports = Router;
