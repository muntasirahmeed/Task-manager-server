/* -------------require file here---------------- */
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
const app = express();
const port = process.env.PORT || 4000;
require("dotenv").config();

/* -------------Middle were Here---------------- */
app.use(cors());
app.use(express.json());

/* -------------MongoDb code Here---------------- */

const uri =
  "mongodb+srv://admin:thXwF3iFeqmaWDob@cluster0.rmanf.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

/*---------------Api Start Here-------------------*/

async function run() {
  try {
    await client.connect();
    const tasksCollection = client.db("task-manager").collection("add-task");
    const completeCollection = client.db("task-manager").collection("add-task");

    //?---------------Post Api-------------------*/
    app.post("/add", async (req, res) => {
      const data = req.body;
      const review = await tasksCollection.insertOne(data);
      res.send(review);
    });
    app.put("/completed-task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updatedData = {
        $set: { complete: true },
      };
      const result = await tasksCollection.updateOne(filter, updatedData);
      res.send(result);
    });
    app.patch("/updated-task/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const updatedData = {
        $set: data,
      };
      const result = await tasksCollection.updateOne(filter, updatedData);
      res.send(result);
    });

    //?---------------Get Api-------------------*/
    app.get("/add", async (req, res) => {
      const data = await tasksCollection.find({}).toArray();
      res.send(data);
    });
    app.get("/complete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tasksCollection.findOne(query);
      res.send(result);
    });
    app.get("/completed-task", async (req, res) => {
      const id = req.params.id;
      const query = { complete: true };
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });

    //?---------------Delete Api-------------------*/
    app.delete("/add/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });
    //?---------------Update Api-------------------*/
    app.get("/updatetask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tasksCollection.findOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

/*---------------Api End Point-------------------*/

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
