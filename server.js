const express = require('express');
const exhbs = require('express-handlebars');
const fs = require('fs');

//* Initilizing the express app
const app = express();

//* Setting up the view engine
app.engine('handlebars', exhbs());
app.set('view engine', 'handlebars');

//* Adding Routes
app.get('/', (req, res) => {
    return res.render('index', {cardShow: false});
});

/*
* @desc: This route gets a query string containing the search term and option.
*        It the sorts through the csv file by first reading the file and then matching the search term and option
*        & pushing the matched object in the array and then passing the array to the view renderer which then parse the
*        dataStream and iterate over it and displays it.
! Addition: -- Further logic for search parsing should be added as of now it just matches the exact search term and Will not work if given bits or short search snippets.
* @param: req, res -> request and the response
* @return: render index template with array passed to it
*/
app.get('/get-jobs', (req, res) => {
    let searchQuery =  req.query.search;
    let option = req.query.option;

    //* Reading the csv file using readFileSync and passing the file location.
    let rawJSONData = fs.readFileSync('./data/1to2000.json');
    let jobData = JSON.parse(rawJSONData);

    //* The array that should contain objects the matched the search criteria
    let retBuffer = [];
    jobData.forEach(job => {
        //* If the searchQuery is equal to job that exists in csv file then just push the whole object in retBuffer
        if (job[option] == searchQuery) {
            retBuffer.push(job);
        }
    });
    return res.render('index', {
        cardShow: true,
        dataStream: retBuffer
    })
});

//* Configuring the port to listen
const port = 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});