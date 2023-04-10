const express = require('express');
const app = express();
const port = 3000;

const { v4: uuidv4 } = require('uuid');

var assigneeId = 1000;
var followerId = 1001;

var currDate = new Date();
var ticketList;

var fs = require('fs');

app.listen(port);
console.log('Server start at http://localhost' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Read file */
fs.readFile('./tickets.json', 'utf-8', (error, data) => {
    if (error) {
        console.log(error);
    } else {
        ticketList = JSON.parse(data);

        if (ticketList && ticketList.length > 0) {
            const lastTicket = ticketList[ticketList.length - 1];
            assigneeId = lastTicket.id + 1;
            followerId = lastTicket.follower_ids[lastTicket.follower_ids.length - 1] + 1;
        }
    }
});

function getDateAndTime()
    {
        var dateTime = currDate.getFullYear() + '-'
        + (currDate.getMonth() + 1) + '-'
        + currDate.getDate() + 'T'
        + currDate.getHours() + ':'
        + currDate.getMinutes() + ':'
        + currDate.getSeconds() + 'Z';

        return (dateTime);
    }

    /** Routes */
    app.get('/', function(req, res) {
        const myquery = req.query;
        var outstring = 'Starting...';
        res.send(outstring);
    });

    app.get('/list', (req, res) => {
        res.json(ticketList);
    });

    app.get('/tickets/:id', (req, res) => {
        const ticket_id = req.params.id;
        const ticket = ticketList.find(ticket => ticket.id === ticket_id);

        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ error: 'Ticket not found!' });
        }
    });

/** Post request */
app.post('/tickets', function(req, res) {
    const type = req.body.type;
    const subject = req.body.subject;
    const description = req.body.description;
    const priority = req.body.priority;
    const submitter = req.body.submitter;
    const tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];

    assigneeId++;
    followerId++;

    const newTicket = {
        'id': uuidv4(),
        'created_at': getDateAndTime(),
        'updated_at': getDateAndTime(),
        'type': type,
        'subject': subject,
        'description': description,
        'priority': priority,
        'status': 'open',
        'recipient': 'support_example@domain.com',
        'submitter': submitter,
        'assignee_id': assigneeId,
        'follower_ids': [assigneeId, followerId],
        'tags': tags
    };

    ticketList.push(newTicket);

    fs.writeFile('tickets.json', JSON.stringify(ticketList), 'utf8', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to write tickets data.' });
        }

        res.json({ message: 'Ticket created successfully.'});
    });
});