const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const getTask = require("./task.json");
const tasks = getTask.tasks;
let currentId = tasks.length + 1;
console.log(currentId);

// app.get("/", (req, res) => {
//   console.log("Hello World");
//   res.send("Hello World");
// });

/* Get All Task */
app.get("/tasks", (req, res) => {
  if (tasks.length === 0) {
    res.status(404).send("No Tasks Found");
  }
  res.send(tasks);
});

/* Get task by id  */
app.get("/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);

  const task = tasks.find((t) => t.id == taskId);

  if (!task) {
    res.status(404).send("Task Not Found");
  }
  res.send(task);
});

/* Add New Task */
app.post("/tasks", (req, res) => {
  console.log(req.body);
  const title = req.body.title;
  const description = req.body.description;
  const completed = req.body.completed;
  if (!title || !description) {
    return res.status(400).send("Please Enter valid data !!");
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).send("Please Enter valid data !!");
  }

  const task = {
    id: currentId,
    title: title,
    description: description || "",
    completed: completed ?? false,
  };

  tasks.push(task);
  currentId++;
  return res.status(201).json(task);
});

/* Get task by id  */
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const title = req.body.title;
  const description = req.body.description;
  const completed = req.body.completed;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).send("Task not found");
  }

  if (!title) {
    return res.status(400).send("Please Enter valid data !!");
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).send("Please Enter valid data !!");
  }

  task.title = title;

  if (description !== undefined) {
    task.description = description;
  }

  if (completed !== undefined) {
    task.completed = completed;
  }

  res.status(200).json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).send("Task not found");
  }

  const deletedTask = tasks.splice(index, 1)[0];

  res.status(200).json(deletedTask);
});

app.listen(port, (err) => {
  if (err) {
    return console.log("Something bad happened", err);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
