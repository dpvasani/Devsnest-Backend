const express = require('express');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
app.use(bodyParser.json());

// Books data storage
let books = [];

// Generate a unique ID
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// GET /api/v1/books
app.get('/api/v1/books', (req, res) => {
  res.json(books);
});

// GET /api/v1/books/:id
app.get('/api/v1/books/:id', (req, res) => {
  const bookId = req.params.id;
  const book = books.find(book => book.id === bookId);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// POST /api/v1/books/add
// POST /api/v1/books/add
app.post('/api/v1/books/add', (req, res) => {
  const { name, author, genre, dateOfRelease, bookImage, rating, price } = req.body;

  if (!name || !author || !genre || !dateOfRelease || !bookImage || !rating || !price) {
    res.status(400).json({ error: 'Name, author, genre, dateOfRelease, bookImage, rating, and price are required' });
    return;
  }

  const newBook = {
    id: generateId(),
    name,
    author,
    genre,
    dateOfRelease,
    bookImage,
    rating,
    price
  };

  books.push(newBook);
  res.status(201).json(newBook);
});


// PUT /api/v1/books/:id
app.put('/api/v1/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { name, author, genre, dateOfRelease, bookImage, rating, price } = req.body;

  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    const updatedBook = {
      ...books[bookIndex],
      name: name || books[bookIndex].name,
      author: author || books[bookIndex].author,
      genre: genre || books[bookIndex].genre,
      dateOfRelease: dateOfRelease || books[bookIndex].dateOfRelease,
      bookImage: bookImage || books[bookIndex].bookImage,
      rating: rating || books[bookIndex].rating,
      price: price || books[bookIndex].price
    };

    books[bookIndex] = updatedBook;
    res.json(updatedBook);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// DELETE /api/v1/books/:id
app.delete('/api/v1/books/:id', (req, res) => {
  const bookId = req.params.id;
  const bookIndex = books.findIndex(book => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
