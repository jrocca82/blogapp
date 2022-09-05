const express = require("express"),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	session = require("express-session"),
	passport = require("passport"),
	app = express();

//Routes
const baseRoutes = require("./controller/routes/base.routes"),
	userRoutes = require("./controller/routes/user.routes"),
	localRoutes = require("./controller/routes/local.routes"),
	articleRoutes = require("./controller/routes/article.routes"),
	fbRoutes = require("./controller/routes/fb.routes")

//DB Connections
const key = require("./key"),
	db = process.env.MONGO_ATLAS_URI,
	port = 3000;

mongoose.connect(db);

//Set up app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: key.session.secret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.set("view engine", "ejs");

//Initialize routes
app.use("/", baseRoutes);
app.use("/auth/local", localRoutes);
app.use("/auth/facebook", fbRoutes);
app.use("/articles", articleRoutes);
app.use("/user", userRoutes);

app.listen(port, (error) => {
    if(!error) {
        console.log("Listening on port", port);
    } else {
        console.log("Error", error);
    }
});
