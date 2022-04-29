const express = require('express');
const cors = require('cors');

const port=process.env.PORT||4000;
const app=express();

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@maincluster.znen7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
try{
    client.connect()
    const itemCollection = client.db("bookathonWarehouse").collection("items");

    

}
finally{

}
}

run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('Server Is ON')
})

app.listen(port, ()=>{
    console.log('listening', port);
})