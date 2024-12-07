const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');
app.use(cors());
app.use(express.json());
require("dotenv").config();





const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.cj231.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("visa");
    const userCollection = database.collection("visa-data");
    const applyCollection = database.collection("apply");

    app.post("/visa", async (req, res) => {
        const receivedData = req.body;
        const result = await userCollection.insertOne(receivedData);
        res.send(result);
        console.log("Received data:", receivedData);
      });
      app.get('/visa/:email',async(req,res)=>{
        const email = req.params.email; // Use email parameter from the URL
        const query = { email: email };
        const result = await userCollection.find(query).toArray();
        res.send(result)
      })
      
    app.post("/apply", async (req, res) => {
        const receivedData = req.body;
        const result = await applyCollection.insertOne(receivedData);
        res.send(result);
        console.log("Received data:", receivedData);
      });

      app.delete("/apply/:id", async(req, res) => {
        const id = req.params.id;
       
        const query = { _id: new ObjectId(id) };
         console.log(query)
        const result = await applyCollection.deleteOne(query)
        console.log(result)
        res.send(result)
  
      });
      app.delete("/visa/:id", async(req, res) => {
        const id = req.params.id;
       
        const query = { _id: new ObjectId(id) };
         console.log(query)
        const result = await userCollection.deleteOne(query)
        console.log(result)
        res.send(result)
  
      });
      app.put('/visa/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const updateVisa = req.body;
      
        console.log(updateVisa);
        const coffee = {
          $set: {
            visaType: updateVisa.visaType,
            countryName: updateVisa.countryName,
            countryImage: updateVisa.countryImage,
            processingTime: updateVisa.processingTime,
            fee: updateVisa.fee,
            applicationMethod: updateVisa.applicationMethod,
          
          }
        };
      
        try {
          const result = await userCollection.updateOne(query, coffee, { upsert: true });
          res.send(result);
        } catch (error) {
          console.error('Error updating coffee:', error);
          res.status(500).send('Error updating coffee');
        }
      
      });
      app.get("/apply", async (req, res) => {
        const visa = await applyCollection.find();
        const result = await visa.toArray();
        res.send(result);
      });

      app.get("/visa", async (req, res) => {
        const visa = await userCollection.find();
        const result = await visa.toArray();
  
        res.send(result);
      });
  


    console.log("Pinged your deployment. You successfully connected to MongoDB!");


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get("/", (req, res) => {
    res.send("Visa makeing server is runing ");
  });
  
  // Start the server
  
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  