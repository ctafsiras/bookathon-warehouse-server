const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 4000;
const app = express();

//middleware

app.use(cors())
app.use(express.json())

//verifying token function

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden' })
        }
        req.decoded = decoded;
        next();
    })


}

//mongodb credential

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@maincluster.znen7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//mongodb database connection function

async function run() {
    try {
        client.connect()
        const itemCollection = client.db("bookathonWarehouse").collection("items");

        //Auth for JWT

        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = await jwt.sign(user, 'secret', {
                expiresIn: '30d'
            });
            res.send({ accessToken })
        })

        //creating post api for add item

        app.post('/items', async (req, res) => {
            const item = req.body;
            const items = await itemCollection.insertOne(item);
            res.send(items);
        })

        //getting api from items

        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        //getting api for my items

        app.get('/myItems', verifyToken, async (req, res) => {
            const decodedEmail = req.decoded.mail;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email };
                const cursor = itemCollection.find(query);
                const items = await cursor.toArray();
                res.send(items);
            } else {
                res.status(403).send({ message: 'Forbidden' })
            }

        })

        //getting api from items for 6 items in homepage

        app.get('/items/6', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.limit(6).toArray();
            res.send(items);
        })

        //getting api from items for 1 item for manage update show only

        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = itemCollection.find(query);
            const item = await cursor.toArray();
            res.send(item);
        })

        //getting api from items for 1 item for manage update part main

        app.put('/items/:id', async (req, res) => {
            const id = req.params.id;
            const quantity = req.query.quantity;
            const newQuantity = { $set: { quantity } }
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.updateOne(query, newQuantity);
            res.send(result);
        })

        //delete an item api

        app.delete('/deleteItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

    }
}

run().catch(console.dir)

//default api to check connection

app.get('/', (req, res) => {
    res.send('Server Is ON')
})

app.listen(port, () => {
    console.log('listening', port);
})