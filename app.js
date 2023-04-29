const express = require('express');
const https = require('https'); // Native HTTPS lib from Node
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    mailchimp.setConfig({
        apiKey: "a46c85dca076c26dd06b11741d12737c8-us9",
        server: "us9",
    });

    const run = async () => {
        const response = await mailchimp.lists.batchListMembers("becdcbc3ec", jsonData
        )
        .then(() => res.sendFile(__dirname + ("/success.html")))
        .catch(() => res.sendFile(__dirname + ("/failure.html")))
    };

    run();

});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT, function () {
    console.log('listening on port 3000');
})

// API KEY -> 46c85dca076c26dd06b11741d12737c8-us9
// LIST ID -> becdcbc3ec