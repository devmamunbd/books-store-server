const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// mongoDB Code

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.lskduub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    // create database collection
    const booksCollections = client.db("BookInventory").collection("books");

    // insert a book to the db: post method
    app.post("/upload-books", async (req, res) => {
      const data = req.body;
      const result = await booksCollections.insertOne(data);
      res.send(result);
    });

    // get ll books from db: get method
    app.get("/all-books", async (req, res) => {
      const books = req.body;
      const result = await booksCollections.find().toArray(books);
      res.send(result);
    });

    // get a single book from db: get method
    app.get("/single-book/:id", async (req, res) => {
      const id = req.params.id;
      const result = await booksCollections.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // update a book in db: put method

    // delete a book from db: delete method
    app.delete("/delete-book/:id", async (req, res) => {
      const id = req.params.id;
      const result = await booksCollections.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
