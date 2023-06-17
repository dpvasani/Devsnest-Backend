const express = require('express');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
app.use(bodyParser.json());

// TODO data storage
let todos = [];

// Generate a unique ID
function generateId() {
  return Math.floor(Math.random() * 1000000);
}

// GET /api/todo
app.get('/api/todo', (req, res) => {
  res.json(todos);
});

// GET /api/todo/:id
app.get('/api/todo/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === todoId);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// POST /api/todo
app.post('/api/todo', (req, res) => {
  const { title, description, dueDate, completed, priority } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const newTodo = {
    id: generateId(),
    title,
    description,
    dueDate,
    completed: completed || false,
    priority: priority || 1
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT /api/todo/:id
app.put('/api/todo/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const { title, description, dueDate, completed, priority } = req.body;

  const todoIndex = todos.findIndex(todo => todo.id === todoId);
  if (todoIndex !== -1) {
    const updatedTodo = {
      ...todos[todoIndex],
      title: title || todos[todoIndex].title,
      description: description || todos[todoIndex].description,
      dueDate: dueDate || todos[todoIndex].dueDate,
      completed: completed !== undefined ? completed : todos[todoIndex].completed,
      priority: priority || todos[todoIndex].priority
    };

    todos[todoIndex] = updatedTodo;
    res.json(updatedTodo);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// DELETE /api/todo/:id
app.delete('/api/todo/:id', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === todoId);

  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
