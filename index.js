const
    express = require('express'),
    app = express(),
    bodyparser = require('body-parser'),
    { createMollieClient } = require('@mollie/api-client'),
    mollieClient = createMollieClient({ apiKey: "test_hUgDRy7uGxV5tRrF8pcFxB5TREA2ed" }),
    mongoose = require("mongoose"),
    Order = require("./models/order");

// dotENV
require('dotenv').config();

// Express variables
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));

// Database connection
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(
    () => {
        console.log('Database is connected')
    },
    err => { console.log('Can not connect to the database' + err) }
);

// ======
// ROUTES
// ======

// DEFAULT
app.get("/", (req, res) => {
    res.render("home");
});

// order route
app.post("/", (req, res) => {
    let ts = Date.now();
    let newDate = new Date(ts);
    let order = {
        name: "Bob Howard",
        amount: "15.00",
        orderedAt: newDate
    };
    Order.create(order, (err, newOrder) => {
        if (err) {
            console.log(err);
            return res.send(err)
        } else {
            return res.redirect("/");
        }
    });
});

// mollie payment
app.get("/mollie", (req, res) => {
    mollieClient.payments.create({
        amount: {
          value:    '15.00',
          currency: 'EUR'
        },
        description: 'mollie test payment',
        redirectUrl: 'https://enigmatic-plateau-68585.herokuapp.com/confirmation',
        webhookUrl:  'https://enigmatic-plateau-68585.herokuapp.com/webhook'
      })
        .then(payment => {
          // Forward the customer to the payment.getCheckoutUrl()
        })
        .catch(error => {
          // Handle the error
        });
});

// payment status webhook
app.post("/webhook", (req, res) => {
    let data = req.body;
    console.log(data);
    res.send(200);
});

// CONFIRMATION
app.get("/confirmation", (req, res) => {
    res.render("confirmation")
});

// listener
app.listen(process.env.PORT, process.env.IP, () => console.log("Mollie Payment demo started on port " + process.env.PORT));