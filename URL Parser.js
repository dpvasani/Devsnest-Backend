const express = require('express');
const app = express();
app.use(express.json());

// Sample data
const urls = [
  {
    id: '63b54c52eeac88d07d171262',
    URL: 'https://www.amazon.in/System-Design-Interview-insiders-guide/dp/B08B35X2ND/ref=sr_1_8?crid=1OA4KI3LSNPXD&keywords=system+desing&qid=1672825892&sprefix=system+desing%2Caps%2C250&sr=8-8',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // More URLs
];

// GET /api/v1/url
app.get('/api/v1/url', (req, res) => {
  res.status(200).json(urls);
});

// GET /api/v1/url/:id
app.get('/api/v1/url/:id', (req, res) => {
  const { id } = req.params;
  const url = urls.find((url) => url.id === id);

  if (!url) {
    return res.status(404).json({ message: 'URL not found' });
  }

  res.status(200).json(url);
});

// POST /api/v1/url/add
app.post('/api/v1/url/add', (req, res) => {
  const { URL } = req.body;

  if (!URL) {
    return res.status(400).json({ message: 'URL is required' });
  }

  const newUrl = {
    id: generateUniqueId(),
    URL,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  urls.push(newUrl);

  res.status(201).json(newUrl);
});

// PUT /api/v1/url/:id
app.put('/api/v1/url/:id', (req, res) => {
  const { id } = req.params;
  const { URL } = req.body;

  const url = urls.find((url) => url.id === id);

  if (!url) {
    return res.status(404).json({ message: 'URL not found' });
  }

  url.URL = URL;
  url.updatedAt = new Date();

  res.status(200).json(url);
});

// DELETE /api/v1/url/:id
app.delete('/api/v1/url/:id', (req, res) => {
  const { id } = req.params;
  const urlIndex = urls.findIndex((url) => url.id === id);

  if (urlIndex === -1) {
    return res.status(404).json({ message: 'URL not found' });
  }

  urls.splice(urlIndex, 1);

  res.status(200).json({ message: 'URL deleted successfully' });
});

// Helper function to generate a unique ID
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 10);
}

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
