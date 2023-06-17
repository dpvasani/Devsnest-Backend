const express = require('express');
const app = express();
app.use(express.json());

// Notices data
let notices = [];

// Generate a unique ID for a new notice
function generateId() {
  return Math.floor(Math.random() * 1000000);
}

// GET /api/notice
app.get('/api/notice', (req, res) => {
  // Sort notices by date
  const sortedNotices = notices.sort((a, b) => new Date(b.date) - new Date(a.date));

  res.status(200).json({ data: sortedNotices });
});

// GET /api/notice/:id
app.get('/api/notice/:id', (req, res) => {
  const { id } = req.params;
  const notice = notices.find((n) => n.id === parseInt(id));

  if (!notice) {
    res.status(404).json({ error: 'Notice not found' });
    return;
  }

  res.status(200).json(notice);
});

// POST /api/notice
app.post('/api/notice', (req, res) => {
  const { author, message } = req.body;

  if (!author || !message) {
    res.status(400).json({ error: 'Author and message are required' });
    return;
  }

  const newNotice = {
    id: generateId(),
    author,
    message,
    date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    likes: 0
  };

  notices.push(newNotice);
  res.status(201).json(newNotice);
});

// PUT /api/notice/:id/like
app.put('/api/notice/:id/like', (req, res) => {
  const { id } = req.params;
  const notice = notices.find((n) => n.id === parseInt(id));

  if (!notice) {
    res.status(404).json({ error: 'Notice not found' });
    return;
  }

  notice.likes++;
  res.status(200).json(notice);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
