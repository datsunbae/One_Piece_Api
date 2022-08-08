const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios')
const dotenv = require('dotenv');
const port = 3000;
const urlAllCharacter = 'https://onepiece.fandom.com/wiki/List_of_Canon_Characters';
const urlCharacter = 'https://onepiece.fandom.com/wiki/';
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
                $('table >  tbody > tr > td:nth-child(2)', html).each(function() {
                    let name = $(this).find("a").attr("title");
                    let url = $(this).find("a").attr("href");
                    obj.push({
                        name: name,
                        url: "https://naruto-movie-api.herokuapp.com/all_characters" + url.split('/wiki')[1]
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
app.use('/all_characters/:character', (req, res) => {
    let image = '';
    const titles = [];
    const details = [];
    const characterObjects = {};
    try {
        axios(urlCharacter + req.params.character)
            .then(response => {
                const html = response.data;
                const $ = cheerio.load(html);
                $('aside > .pi-image-collection > .wds-is-current', html).each(function() {
                    image = $(this).find('img').attr('src');
                })

                $('aside', html).each(function() {
                    //Get character images
                    $(this).find('.pi-image-collection > .wds-is-current > img').each(function() {
                        images.push($(this).attr('src'));
                    });

                    //Get character titles
                    $(this).find('aside > section > div > h3').each(function() {
                        titles.push($(this).text().toLowerCase().replace(':', ''));
                    })

                    //Get charactor details
                    $(this).find('aside > section > div > .pi-data-value').each(function() {
                        details.push($(this).text());
                    })

                });

                for(let i = 0; i < titles.length; i++){
                    characterObjects[titles[i]] = details[i];
                }
                const newCharacterObjects = {
                    image,
                    ...characterObjects
                }
                res.status(200).json(newCharacterObjects);
            })
    }catch (err){
        res.status(500).json(err);
    }
})


app.listen(process.env.PORT || port, () => {
    console.log('Server is running...');
});
