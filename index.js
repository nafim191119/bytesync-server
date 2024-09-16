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
        const clientCollection = client.db("bytesync").collection("client");

        app.post('/api/contact', async (req, res) => {
            const contactData = req.body;
            try {
                // Insert the form data into the customer collection
                const result = await clientCollection.insertOne(contactData);
                res.status(201).send({ success: "Your message has been sent successfully!" });
            } catch (error) {
                console.error("Error saving contact data:", error);
                res.status(500).send({ error: "Failed to send the message." });
            }
        });
        app.post('/team', async (req, res) => {
            const teamMember = req.body;

            try {
                const result = await teamCollection.insertOne(teamMember);
                res.status(201).send({ success: "Team member added successfully!" });
            } catch (error) {
                console.error("Error adding team member:", error);
                res.status(500).send({ error: "Failed to add team member." });
            }
        });
        app.post('/service', async (req, res) => {
            const addService = req.body;

            try {
                const result = await servicesCollection.insertOne(addService);
                res.status(201).send({ success: "Team member added successfully!" });
            } catch (error) {
                console.error("Error adding team member:", error);
                res.status(500).send({ error: "Failed to add team member." });
            }
        });

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
