const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { price } = require('./rentalPrice');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/pictures', express.static('images'));

// HTML templates
const formHtml = fs.readFileSync('form.html', 'utf8');
const resultHtml = fs.readFileSync('result.html', 'utf8');

// Routes
app.get('/', (req, res) => {
    res.send(formHtml);
});

app.post('/', (req, res) => {
    const {
        pickup,
        dropoff,
        pickupdate,
        dropoffdate,
        type,
        age,
        licenseYear
    } = req.body;

    const rentalPrice = price(
        String(pickup),
        String(dropoff),
        Date.parse(pickupdate),
        Date.parse(dropoffdate),
        String(type),
        Number(age),
        Number(licenseYear)
    );

    res.send(formHtml + resultHtml.replaceAll('$0', rentalPrice));
});

// Start server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
