const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 4000;
const app = express();

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@maincluster.znen7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        client.connect()
        const itemCollection = client.db("bookathonWarehouse").collection("items");

        //creating post api for item add

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

        app.get('/myItems', async (req, res) => {
            const email = req.query.email;
            const query = { email };
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        //getting api from items for 6 items

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
            const quantity=req.query.quantity;
            const newQuantity={$set:{quantity}}
            const query = { _id: ObjectId(id) };
            console.log(query);
            const result = await itemCollection.updateOne(query, newQuantity);
            res.send(result);
            console.log(result);
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

app.get('/', (req, res) => {
    res.send('Server Is ON')
})

app.listen(port, () => {
    console.log('listening', port);
})