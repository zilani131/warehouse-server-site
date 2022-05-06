const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port=process.env.PORT||5000;
const app =express();
require('dotenv').config();
// username: zilaniWareHouse
// pw:66ZI1l0u4cHxSBNB
// middleware

//
const uri = "mongodb+srv://zilaniWareHouse:66ZI1l0u4cHxSBNB@cluster0.muqt3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
try{
    await client.connect();
    const itemsCollection = client.db("warehouse").collection("vehicles");
    app.get('/', async (req,res)=>{
        const query={};
        const cursor=itemsCollection.find(query);
        const result=await cursor.toArray();
        res.send(result)
        console.log(result)
    })
}
finally{

}
}
run().catch(console.dir)

/*
*/
app.use(cors());
app.use(express.json());

app.listen(port,()=>{
    console.log(`listent to the port ${port}`)
}
);