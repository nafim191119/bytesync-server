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

const adminEmail = 'nafim191119@gmail.com';

// Admin check middleware
function adminCheck(req, res, next) {
    const userEmail = req.body.email || req.user?.email;
    if (userEmail === adminEmail) {
        next();
    } else {
        res.status(403).send({ error: "You do not have permission to access this resource." });
    }
}

async function run() {
    try {
        await client.connect();

        const servicesCollection = client.db("bytesync").collection("services");
        const teamCollection = client.db("bytesync").collection("team");
        const reviewsCollection = client.db("bytesync").collection("reviews");
        const clientCollection = client.db("bytesync").collection("client");
        const webProjectCollection = client.db("bytesync").collection("webProjects");
        const appProjectCollection = client.db("bytesync").collection("appProjects");

        app.post('/client', async (req, res) => {
            const contactData = req.body;
            try {
                const result = await clientCollection.insertOne(contactData);
                res.status(201).send({ success: "Client data has been added successfully!" });
            } catch (error) {
                res.status(500).send({ error: "Failed to add client data." });
            }
        });

        // Protected route for adding team member (admin only)
        app.post('/team', adminCheck, async (req, res) => {
            const teamMember = req.body;
            try {
                const result = await teamCollection.insertOne(teamMember);
                res.status(201).send({ success: "Team member added successfully!" });
            } catch (error) {
                console.error("Error adding team member:", error);
                res.status(500).send({ error: "Failed to add team member." });
            }
        });
        

        // Protected route for adding services (admin only)
        app.post('/service', adminCheck, async (req, res) => {
            const addService = req.body;
            try {
                const result = await servicesCollection.insertOne(addService);
                res.status(201).send({ success: "Service added successfully!" });
            } catch (error) {
                console.error("Error adding service:", error);
                res.status(500).send({ error: "Failed to add service." });
            }
        });

        // Public routes for getting data
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

        app.get('/client', async (req, res) => {
            const result = await clientCollection.find().toArray();
            res.send(result);
        });
        app.get('/webprojects', async (req, res) => {
            const result = await webProjectCollection.find().toArray();
            res.send(result);
        });
        app.get('/appprojects', async (req, res) => {
            const result = await appProjectCollection.find().toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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
