const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const { json } = require("express/lib/response");
const port = process.env.PORT || 5000;
const app = express();
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// username: zilaniWareHouse
// pw:66ZI1l0u4cHxSBNB
// middleware
app.use(cors());
app.use(express.json());
//
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.muqt3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const itemsCollection = client.db("warehouse").collection("vehicles");
    app.get("/home", async (req, res) => {
      const query = {};
      const cursor = itemsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
      console.log(result);
    });
    //dynamic route for inventory item
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.findOne(query);
      res.json(result);
      console.log(result);
    });
    // reduce quantity
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const item = req.body.newQuantity;
      console.log(item);
      const filter = { _id: ObjectId(id) }; //name doesn't matter
      const options = { upsert: true }; //to update we need it
      const updateDoc = {
        $set: {
          quantity: item, //must be give the value in this format
        },
      };
      const result = await itemsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result)
      res.send(result);
    });
    // adding new item
    app.post("/home",async (req, res) => {
        const newItem=req.body;
        const result = await itemsCollection.insertOne(newItem);
        res.send(result)

    });
    // my items
    app.get("/myitem",async (req,res)=>{
        const email=req.query.email;
        console.log(email)
        const query={email:email}
        console.log(query)
        const cursor=itemsCollection.find(query)
        const result=await cursor.toArray()
        res.send(result)
    })
    //delete item
    app.delete("/home/:id",async (req,res)=>{
        console.log(req.params)
        const id=req.params.id;
        const query={_id:ObjectId(id)}
        const result = await itemsCollection.deleteOne(query);
        console.log(result)
        res.json(result)
    })

  } finally {
  }
}
run().catch(console.dir);

/*
 */
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`listent to the port ${port}`);
});
