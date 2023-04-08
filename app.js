var express = require('express');
var fs = require('fs');
var parser = require('body-parser');
var app = express();
var router = express.Router();
var ticketList;
port = 3000;

app.use(parser.json());

fs.readFile('./testTicket.json', 'utf-8', (err, data) => {
    if (err) {
        console.log('Error in readfile: ', err);
    } else {
        ticketList = JSON.parse(data);
    }
});

router.get('/', function(req, res) {
    console.log('Start page!');
});

router.get('/list', (req, res) => {
    res.json(ticketList);
});

router.get('/ticket/:id', (req, res) => {
    res.json(ticketList.req.params.d);
});

router.post('/new-tickets', (req, res) => {
    var body = req.body;
    var id = 0;
    for (var i in ticketList) {
        id++;
    }
    body.id = id;
    ticketList.id = body;
    res.status(201).json(ticketList.id);
});

app.use(router);
app.listen(port, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Server started at http://localhost:', port)
    }
})