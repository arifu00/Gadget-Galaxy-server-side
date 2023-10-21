const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middle-ware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.DB_PASS}@cluster0.kalsdro.mongodb.net/?retryWrites=true&w=majority`;

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

    const totalBrands = client.db("gadgetGalaxyDB").collection("brands");
    const productCollection = client
      .db("gadgetGalaxyDB")
      .collection("products");
    const cardCollection = client.db("gadgetGalaxyDB").collection("addtocard");

    // brands API
    app.get("/brands", async (req, res) => {
      const cursor = totalBrands.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/brands/:brandName", async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brandName: brandName };
      const result = await totalBrands.findOne(query);
      // console.log(result);
      res.send(result);
    });
    app.post("/brands", async (req, res) => {
      const brands = req.body;
      console.log(brands);
      const result = await totalBrands.insertOne(brands);
      res.send(result);
    });

    //  Products API

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.get("/updateproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          productName: updatedProduct.productName,
          brandName: updatedProduct.brandName,
          productType: updatedProduct.productType,
          shortDescription: updatedProduct.shortDescription,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          photo: updatedProduct.photo,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // add to card API

    app.get("/addtocard", async (req, res) => {
      const cursor = cardCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/addtocard/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cardCollection.findOne(query);
      console.log(result);
      res.send(result);
    });
    app.post("/addtocard", async (req, res) => {
      const cardProduct = req.body;
      console.log(cardProduct);
      const result = await cardCollection.insertOne(cardProduct);
      res.send(result);
    });
    app.delete("/addtocard/:id", async (req, res) => {
      const id = req.params.id;
      console.log("please remove this", id);
      const query = { _id: new ObjectId(id) };
      const result = await cardCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
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

app.get("/", (req, res) => {
  res.send("Hlw World");
});

app.listen(port, () => {
  console.log("server running on port :", port);
});
