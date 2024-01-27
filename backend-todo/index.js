const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const mongoose = require("mongoose");

console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);
const Todo = mongoose.model("Todo", {
  id: Number,
  task: String,
  status: Boolean,
  date: String,
  skills: Array,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // convert input form to json

app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

app.get("/todo", async (req, res) => {
  // console.log(req);
  const { query } = req;
  console.log("On page:", query.page, "pages(n):", query.pageSize);
  const todos = await Todo.find({})
    .skip(query.pageSize * (query.page - 1))
    .limit(query.pageSize);

  const countTasks = await Todo.countDocuments({});
  res.status(200).send({ todos, countTasks });
});

app.post("/todo/add", async (req, res) => {
  console.log(req.body.formData);
  const { task, date, status, skills } = req.body.formData;
  const newTodo = new Todo({
    task,
    date,
    status,
    skills,
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
  const formData = req.body.formData;
  console.log(formData);
  const todo = await Todo.findById(req.params._id);
  if (todo) {
    // console.log(req.params._id, todo);
    todo.task = formData.task;
    todo.date = formData.date;
    todo.status = formData.status;
    todo.skills = formData.skills;

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

// *** use build version(frontend) for production, use proxy, solve cors err
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/dist/index.html"));
// });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running at http://localhost/${port}`);
});
