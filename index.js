const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
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

    app.post("/visa", async (req, res) => {
        const receivedData = req.body;
        const result = await userCollection.insertOne(receivedData);
        res.send(result);
        console.log("Received data:", receivedData);
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
  