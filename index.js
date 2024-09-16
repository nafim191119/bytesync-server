const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2go6xuw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();

        const servicesCollection = client.db("bytesync").collection("services");
        const teamCollection = client.db("bytesync").collection("team");
        const reviewsCollection = client.db("bytesync").collection("reviews");

        // Endpoint to get services data from MongoDB
        app.get('/services', async (req, res) => {
            const result = await servicesCollection.find().toArray();
            res.send(result);
        });
        app.get('/team', async (req, res) => {
            const result = await teamCollection.find().toArray();
            res.send(result);
        });
        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Optionally, ensure the client closes after the process (if needed)
        // await client.close();
    }
}
run().catch(console.dir);

// Root route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
