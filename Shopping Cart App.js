const express = require('express');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
app.use(bodyParser.json());

// Products data storage
let products = [];

// Generate a unique ID
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// GET /api/v1/products
app.get('/api/v1/products', (req, res) => {
  res.json({ products });
});

// GET /api/v1/products/:id
app.get('/api/v1/products/:id', (req, res) => {
  const productId = req.params.id;
  const product = products.find(product => product.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// POST /api/v1/products/add
app.post('/api/v1/products/add', (req, res) => {
  const { name, description, productImage, date, brand, cost } = req.body;

  if (!name || !description || !productImage || !date || !brand || !cost) {
    res.status(400).json({ error: 'Name, description, productImage, date, brand, and cost are required' });
    return;
  }

  const newProduct = {
    id: generateId(),
    name,
    description,
    productImage,
    date,
    brand,
    cost
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/v1/products/:id
app.put('/api/v1/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, description, productImage, date, brand, cost } = req.body;

  const productIndex = products.findIndex(product => product.id === productId);
  if (productIndex !== -1) {
    const updatedProduct = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      description: description || products[productIndex].description,
      productImage: productImage || products[productIndex].productImage,
      date: date || products[productIndex].date,
      brand: brand || products[productIndex].brand,
      cost: cost || products[productIndex].cost
    };

    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// DELETE /api/v1/products/:id
app.delete('/api/v1/products/:id', (req, res) => {
  const productId = req.params.id;
  const productIndex = products.findIndex(product => product.id === productId);

  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    res.sendStatus(200);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
