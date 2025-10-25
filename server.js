// Minimal Express API server to connect to MongoDB Atlas and expose collections used by the frontend.

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI environment variable is not set. Exiting.');
    process.exit(1);
}
const DB_NAME = process.env.DB_NAME || 'smart_campus';

let dbClient;
let db;

async function connectDB() {
    if (db) return db;
    dbClient = new MongoClient(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1
    });
    await dbClient.connect();
    db = dbClient.db(DB_NAME);
    console.log('Connected to MongoDB:', DB_NAME);
    return db;
}

// Simple healthcheck
app.get('/api/ping', (req, res) => res.json({ ok: true }));

// Generic collection endpoints
function makeCollectionRoutes(name) {
    app.get(`/api/${name}`, async (req, res) => {
        const database = await connectDB();
        const items = await database.collection(name).find({}).toArray();
        res.json(items);
    });

    app.post(`/api/${name}`, async (req, res) => {
        const database = await connectDB();
        const body = req.body;
        const result = await database.collection(name).insertOne(body);
        res.json({ insertedId: result.insertedId });
    });
}

// Create routes for collections used by frontend
['lostitems', 'events', 'feedback', 'clubs', 'notifications', 'users'].forEach(makeCollectionRoutes);

// allow dev connections from frontend (relax only for local dev)
app.use((req, res, next) => {
    // permit scripts and connect to localhost:4000 during development
    res.setHeader('Content-Security-Policy',
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:4000; " +
        "connect-src 'self' http://localhost:4000 ws://localhost:4000; " +
        "script-src 'self' 'unsafe-inline' http://localhost:4000; " +
        "style-src 'self' 'unsafe-inline';"
    );
    next();
});

// serve frontend files from project root
app.use(express.static(path.join(__dirname)));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`API server running on http://localhost:${PORT}`);
});