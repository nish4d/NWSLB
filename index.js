const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URI
const uri =
  "mongodb+srv://name:pass@cluster0.2bnixnr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connection function
async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB!");
    return true;
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    return false;
  }
}

// Health check endpoint
app.get("/", async (req, res) => {
  res.json({ status: "API is running" });
});

// POST endpoint to save user data
app.post("/api/users", async (req, res) => {
  try {
    // Ensure database connection
    await connectToDatabase();

    const { name, email, comment } = req.body;

    // Validate required fields
    if (!name || !email || !comment) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const collection = client.db("nishad").collection("nishad1");

    const result = await collection.insertOne({
      name,
      email,
      comment,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Data saved successfully",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to retrieve all users
app.get("/api/users", async (req, res) => {
  try {
    // Ensure database connection
    await connectToDatabase();

    const collection = client.db("name").collection("name");
    const users = await collection.find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE endpoint to remove a user by ID
app.delete("/api/users/:id", async (req, res) => {
  try {
    // Ensure database connection
    await connectToDatabase();

    const userId = req.params.id;

    // Validate if ID is valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const collection = client.db("nishad").collection("nishad1");

    const result = await collection.deleteOne({
      _id: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Export the app for Vercel
module.exports = app;

// Start the server if running locally
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
