const express = require('express');
const cheerio = require('cheerio');
const dotenv = require('dotenv');
const port = 3000;

const app = express();

app.get('/', (req, res) => {
    res.status(200).json('Naruto Api');
})

app.listen(port, () => {
    console.log('Server is running...');
});