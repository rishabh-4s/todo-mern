const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('./config');
const User = require('./User');
const Todos = require('./Todos');
const app = express();
const port = 4000;

const ObjectId = require("mongoose").Types.ObjectId;

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).exec();
  if (user) {
    res.status(500);
    res.json({
      message: "user already exists",
    });
    return;
  }
//   console.log(req.body)
  let data = new User(req.body);
  let result = await data.save();
//   console.log(result);
  res.json({
    message: "success",
  });
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();
    if (!user || user.password !== password) {
      res.status(403);
      res.json({
        message: "invalid login",
      });
      return;
    }
    res.json({
      message: "success",
    });
});
  
app.post("/todos", async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(" ");
  const [username, password] = token.split(":");
  const todosItems = req.body;
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "invalid access",
    });
    return;
  }
  const todos = await Todos.findOne({ userId: user._id }).exec();
  if (!todos) {
    await Todos.create({
      userId: user._id,
      todos: todosItems,
    });
  } else {
    todos.todos = todosItems;
    await todos.save();
  }
  res.json(todosItems);
});

app.get("/todos", async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(" ");
  const [username, password] = token.split(":");
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "invalid access",
    });
    return;
  }
  const todosList=await Todos.findOne({ userId: user._id }).exec();
  if(!todosList){
    res.status(500);
    res.json();
    return;
  }
  const { todos } = todosList;
  res.json(todos);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
