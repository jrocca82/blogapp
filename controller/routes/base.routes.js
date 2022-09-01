const Router = require("express").Router(),
	User = require("../../model/user.model");
Article = require("../../model/article.model");

Router.get("/", (req, res) => {
	if (!req.session.user) {
		res.redirect("/signup");
	} else {
		res.redirect("/dashboard");
	}
});

Router.get("/signup", (req, res) => {
	res.render("signup", { errors: [] });
});

Router.get("/login", (req, res) => {
	res.render("login", { errors: [] });
});

Router.get("/dashboard", (req, res) => {
	if (req.session.user || req.user) {
		let user = req.session.user || req.user;
		let user_ids = [];
		User.find({ username: { $in: user.people_you_are_following } })
			.then((usrs) => {
				usrs.forEach((usr) => user_ids.push(usr.id));
			})
			.then(() => {
				Article.find({ author: { $in: user_ids } })
					.populate("author", ["username"])
					.then((articles) => {
						res.render("dashboard", { articles });
					});
			});
	} else {
		res.redirect("/");
	}
});

Router.get("/create_article", (req, res) => {
	res.render("create_article");
});

Router.get("/search/:tag", (req, res) => {
	Article.find({ tags: req.params.tag })
		.populate("author", "username")
		.then((articles) => {
			res.render("search", { articles });
		});
});

Router.get("/search", (req, res) => {
	res.render("search", { articles: [] });
});

Router.get("/profile/:username", (req, res) => {
    if(req.session.user || req.user) {
        let user = req.session.user || req.user;
        let alreadyFollowingParamsUser = user.people_you_are_following.includes(req.params.username);
        User.findOne({ username: req.params.username }).then((user) => {
            Article.find({ auth: user._id }).then((articles) => {
                res.render("profile", {articles, user, alreadyFollowingParamsUser,});
            })
        }).catch(error => {
            //If no user found
            res.redirect("/");
        })
    } else {
        res.redirect("/");
    }
});

//Redirect to above based on user that is logged in
//Use in nav tags
Router.get("/profile", (req, res) => {
    if(req.session.user || req.user) {
        let user = req.session.user || req.user;
        res.redirect("/profile/" + user.username);
    } else {
        res.redirect("/")
    }
});

module.exports = Router;
