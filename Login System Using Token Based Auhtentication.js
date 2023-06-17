const express = require('express');
const app = express();
app.use(express.json());

// Sample data
const users = [];
const jobs = [];

// POST /api/v1/auth/register
app.post('/api/v1/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  const newUser = {
    name,
    email,
    password
  };

  users.push(newUser);

  const token = generateAuthToken(newUser);

  res.status(201).json({ user: { name: newUser.name }, token });
});

// POST /api/v1/auth/login
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find((user) => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateAuthToken(user);

  res.status(200).json({ user: { name: user.name }, token });
});

// POST /api/v1/jobs
app.post('/api/v1/jobs', authenticateUser, (req, res) => {
  const { company, position } = req.body;

  if (!company || !position) {
    return res.status(400).json({ message: 'Company and position are required' });
  }

  const createdBy = req.user.id;
  const status = 'pending';

  const newJob = {
    company,
    position,
    status,
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  jobs.push(newJob);

  res.status(201).json({ job: newJob });
});

// GET /api/v1/jobs
app.get('/api/v1/jobs', authenticateUser, (req, res) => {
  const createdBy = req.user.id;
  const userJobs = jobs.filter((job) => job.createdBy === createdBy);

  res.status(200).json({ jobs: userJobs, count: userJobs.length });
});

// GET /api/v1/jobs/:id
app.get('/api/v1/jobs/:id', authenticateUser, (req, res) => {
  const jobId = req.params.id;

  const job = jobs.find((job) => job._id === jobId);

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  res.status(200).json({ job });
});

// PATCH /api/v1/jobs/:id
app.patch('/api/v1/jobs/:id', authenticateUser, (req, res) => {
  const jobId = req.params.id;

  const job = jobs.find((job) => job._id === jobId);

  if (!job) {
    return res.status(400).json({ message: 'Job not found' });
  }

  if (job.createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const { company, position } = req.body;

  if (!company || !position) {
    return res.status(400).json({ message: 'Company and position are required' });
  }

  job.company = company;
  job.position = position;
  job.updatedAt = new Date();

  res.status(200).json({ job });
});

// DELETE /api/v1/jobs/:id
app.delete('/api/v1/jobs/:id', authenticateUser, (req, res) => {
  const jobId = req.params.id;

  const jobIndex = jobs.findIndex((job) => job._id === jobId);

  if (jobIndex === -1) {
    return res.status(400).json({ message: 'Job not found' });
  }

  if (jobs[jobIndex].createdBy !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  jobs.splice(jobIndex, 1);

  res.status(200).json({ message: 'Job deleted successfully' });
});

// Middleware to authenticate user based on the token
function authenticateUser(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Here, you can implement your logic to verify the token and extract the user information
  // For simplicity, let's assume the token contains the user's ID
  const userId = verifyAuthToken(token);

  if (!userId) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const user = users.find((user) => user.id === userId);

  if (!user) {
    return res.status(401).json({ message: 'Invalid user' });
  }

  req.user = user;
  next();
}

// Helper function to generate an authentication token
function generateAuthToken(user) {
  // Here, you can implement your logic to generate a JWT or any other token
  // For simplicity, let's assume the token is a simple string concatenation of user's ID and name
  return `${user.id}-${user.name}`;
}

// Helper function to verify the authentication token
function verifyAuthToken(token) {
  // Here, you can implement your logic to verify and decode the JWT or any other token
  // For simplicity, let's assume the token is a simple string concatenation of user's ID and name
  const [userId] = token.split('-');
  return userId;
}

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
