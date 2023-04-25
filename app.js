require('dotenv').config();

const express = require('express');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const mongoDbUrl = process.env.DB_CLUSTER_URL;
const port = 3000;

const { v4: uuidv4 } = require('uuid');

var assigneeId = 1000;
var followerId = 1001;

// Need to reimplament this!
//var fs = require('fs');


app.listen(port);
console.log('Server start at http://localhost' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    
function getDateAndTime()
{
    const now = Date.now();
    const dateTime = new Date(now).toISOString();
    return dateTime;
}

mongoClient.connect(
    mongoDbUrl, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Connect to MongoDB!');
            
            const db = client.db('Cluster0');
            const ticketsCollection = db.collection('tickets');

            /** Routes */
            // Home Page
            app.get('/', function(req, res)
            {
                const myquery = req.query;
                var outstring = "Starting..."
                    + "\n'/tickets' - GET all tickets"
                    + "\n'/tickets/:id' - GET a ticket by Id"
                    + "\n'/tickets' - POST a new ticket"
                    + "\n'/tickets/:id' - DELETE a ticket by Id"
                    + "\n'/tickets/:id' - UPDATE a ticket by Id";
                
                res.send(outstring);
            });

            // GET all tickets
            app.get('/tickets', (req, res) => {
                ticketsCollection.find({}).toArray((err, docs) => {
                    if (err) {
                        console.error(err);
                    } else {
                        res.json(docs);
                    }
                });
            });

            // GET a single ticket
            app.get('/tickets/:id', (req, res) => {
                const ticket_id = req.params.id;
                ticketsCollection.findOne({id: ticket_id}, (err, doc) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({error: 'Failed to find the ticket!'});
                    } else if (doc) {
                        res.json(doc);
                    } else {
                        res.status(404).json({error: 'Ticket not found!'});
                    }
                });
            });

            // POST a new ticket
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

                ticketsCollection.insertOne(newTicket, (err, result) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({error: 'Failed to create ticket!'});
                    } else {
                        res.json({message: 'Ticket created successfully!', id: newTicket.id});
                    }
                });
            });

            // DELETE a ticket
            app.delete('/tickets/:id', (req, res) => {
                const ticket_id = req.params.id;
                
                ticketsCollection.deleteOne({id: ticket_id}, (err, result) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({error: 'Failed to delete ticket!'});
                    } else if (!result.deletedCount){
                        res.status(404).json({error: `Ticket with Id ${ticket_id} not found!`});
                    } else {
                        res.status(200).json({message: `Ticket with Id ${ticket_id} deleted successfully!`});
                    }
                });
            });

            // UPDATE a ticket
            app.put('/tickets/:id', (req, res) => {
                const ticket_id = req.params.id;

                ticketsCollection.findOne({id: ticket_id}, (err, doc) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({error: 'Failed to find the ticket!'});
                    } else if (!doc) {
                        res.status(404).json({error: 'Ticket not found!'});
                    } else {
                        const updateData = {'updated_at': getDateAndTime()};
                        if (req.body.type) updateData.type = req.body.type;
                        if (req.body.subject) updateData.subject = req.body.subject;
                        if (req.body.description) updateData.description = req.body.description;
                        if (req.body.priority) updateData.priority = req.body.priority;
                        if (req.body.status) updateData.status = req.body.status;
                        if (req.body.recipient) updateData.recipient = req.body.recipient;
                        if (req.body.submitter) updateData.submitter = req.body.submitter;
                        if (req.body.assignee_id) updateData.assignee_id = req.body.assignee_id;
                        if (req.body.follower_ids) updateData.follower_ids = req.body.follower_ids;
                        if (req.body.tags) updateData.tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];

                        const mergedData = Object.assign({}, doc, updateData);

                        ticketsCollection.updateOne({id: ticket_id}, {$set: mergedData}, (err, result) => {
                            if (err) {
                                console.error(err);
                                res.status(500).json({error: 'Failted to update the ticket!'});
                            } else {
                                res.json({message: `Ticket with Id ${ticket_id} updated successfully!`});
                            }
                        });
                    }
                });
            });
        }
    });
