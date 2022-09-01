const nodemailer = require("nodemailer");
const key = require("./key");

let client = nodemailer.createTransport({
	service: "SendGrid",
	auth: {
		user: key.sendGrid.username,
		pass: key.sendGrid.password,
	},
});

let email = {
	from: key.sendGrid.username,
	to: newuser.email,
	subject: "Welcome to Node Blogger",
	html: "<h2>Welcome to Node Blogger!</h2><br/><p>Thank you for signing up.</p>",
};

client.sendMail(email, function(err, info){
    if(err) {
        console.error(error);
    }
    console.log("Message sent: " + info.response);
});

//Send grid
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })