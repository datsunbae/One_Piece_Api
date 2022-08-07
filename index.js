const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios')
const dotenv = require('dotenv');
const port = 3000;
const urlAllCharacter = 'https://onepiece.fandom.com/wiki/List_of_Canon_Characters';
const app = express();

//SET UP PROJECT
dotenv.config();

//ROUTES 

//GET ALL CHARACTERS
app.get('/all_characters', (req, res) => {
    const obj = [];
    const limit = Number(req.query.limit);
    try{
        axios(urlAllCharacter)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                $('.wikitable > tbody > tr > td:nth-child(2)', html).each(function() {
                    let name = $(this).find("a").attr("title");
                    let url = $(this).find("a").attr("href");
                    obj.push({
                        name: name,
                        url: "http://localhost:3000/all_characters" + url.split('/wiki')[1]
                    })
                })

                if(limit && limit > 0){
                    res.status(200).json(obj.slice(0, limit));
                    return;
                }
                res.status(200).json(obj);
                
            })
    }catch(err){
        console.log(err)
        res.status(500).json(err);
    }
})

//GET A CHARACTERS



app.listen(port, () => {
    console.log('Server is running...');
});
