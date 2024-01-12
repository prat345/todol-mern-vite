const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017");
const Todo = mongoose.model("Todo", { task: String, id: Number });

const app = express();
const port = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // convert input form to json

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.get("/todo", async (req, res) => {
  // console.log(req);
  const { query } = req;
  console.log("On page:", query.page, "N pages:", query.pageSize);
  const todos = await Todo.find({})
    .skip(query.pageSize * (query.page - 1))
    .limit(query.pageSize);

  const countTasks = await Todo.countDocuments({});
  res.status(200).send({ todos, countTasks });
});

app.post("/todo/add", async (req, res) => {
  console.log(req.body.task);
  const newTodo = new Todo({
    task: req.body.task,
  });
  const todo = await newTodo.save(); // save to db
  res.send({
    task: todo.task,
  });
});

app.delete("/todo/delete/:_id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params._id);
  console.log(req.params._id, todo);
  res.send({ task: todo.task });
});

app.put("/todo/update/:_id", async (req, res) => {
  const todo = await Todo.findById(req.params._id);
  if (todo) {
    console.log(req.params._id, todo);
    todo.task = req.body.newTask;
    const updatedTodo = await todo.save();
    res.send({ task: updatedTodo.task });
  } else {
    res.status(404).send({ message: "not found" });
  }
});

app.post("/todo/delete_selected", async (req, res) => {
  console.log("Selected ", req.body.selectedTasks);
  const result = await Todo.deleteMany({
    _id: { $in: req.body.selectedTasks },
  });
  console.log({ result });
  res.send({ result: result.deletedCount });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost/${port}`);
});