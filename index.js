const
    express = require('express'),
    app = express(),
    bodyparser = require('body-parser'),
    { createMollieClient } = require('@mollie/api-client'),
    mollieClient = createMollieClient({ apiKey: 'test_hUgDRy7uGxV5tRrF8pcFxB5TREA2ed' });

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

// CONFIRMATION
app.get("/confirmation", (req, res) => {
    res.render("confirmation")
});

// listener
app.listen(process.env.PORT, process.env.IP, () => console.log("Mollie Payment demo started on port " + process.env.PORT));