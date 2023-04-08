const express = require('express');
const bParse = require('body-parser');
const app = express();
const port = 3000;
const ticketId = 1000;
const assigneeId = 100000;
const followerId = 1;

var fs = require('fs');
const { timeStamp } = require('console');
var ticketList;

app.listen(port);
console.log('Server start at http://localhost' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Read file */
fs.readFile('./support-tickets.json', 'utf-8', (error, data) => {
    if (error) {
        console.log(error);
    } else {
        ticketList = JSON.parse(data);
    }
});

/** Routes */
app.get('/', function(req, res) {
    const myquery = req.query;
    var outstring = 'Starting...';
    res.send(outstring);
});

app.get('/list', (req, res) => {
    res.json(ticketList);
});

/** Post request */
app.post('/post/ticket', function(req, res) {
    const type = req.body.type;
    const subject = req.body.subject;
    const description = req.body.description;
    const priority = req.body.priority;
    const submitter = req.body.submitter;
    const tags = req.body.tags;

    ticketId++;
    assigneeId++;
    followerId++;

    ticketList.id = body;
    
    res.send({
        'id': ticketId,
        'created_at': get(timeStamp),
        'updated_at': '',
        'type': type,
        'subject': subject,
        'description': description,
        'priority': priority,
        'status': 'open',
        'recipient': 'support_example@domain.com',
        'submitter': submitter,
        'assignee_id': assigneeId,
        'follower_ids': [assigneeId, followerId],
        'tags': [tags]
    });
});