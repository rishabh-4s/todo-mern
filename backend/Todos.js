const mongoose = require('mongoose');

const todosSchema = new mongoose.Schema({
    userId: mongoose.Schema.ObjectId,
    todos: [
      {
        checked: Boolean,
        text: String,
        id: String,
      },
    ],
  });
module.exports = mongoose.model("todos", todosSchema);