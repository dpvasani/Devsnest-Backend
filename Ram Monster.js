const express = require('express');
const app = express();
app.use(express.json());

// Sample RAM products data
const ramProducts = [
  {
    id: '1',
    name: 'Corsair Vengeance',
    capacity: 8,
    channelType: 'dual-channel',
    ddr: 4,
    clockSpeed: 3200,
    imageUrl: 'https://example.com/ram1.jpg',
    price: 80
  },
  {
    id: '2',
    name: 'G.Skill TridentZ',
    capacity: 16,
    channelType: 'quad-channel',
    ddr: 5,
    clockSpeed: 3600,
    imageUrl: 'https://example.com/ram2.jpg',
    price: 120
  },
  // ... More RAM products
];

// GET /api/products
app.get('/api/products', (req, res) => {
  const { start = 0, end = 9, capacity, channelType, ddr, clockSpeed, name } = req.query;

  let filteredProducts = ramProducts;

  if (capacity) {
    const capacityFilter = parseInt(capacity);
    filteredProducts = filteredProducts.filter((product) => product.capacity === capacityFilter);
  }

  if (channelType) {
    filteredProducts = filteredProducts.filter((product) => product.channelType === channelType);
  }

  if (ddr) {
    const ddrFilter = parseInt(ddr);
    filteredProducts = filteredProducts.filter((product) => product.ddr === ddrFilter);
  }

  if (clockSpeed) {
    const clockSpeedFilter = parseInt(clockSpeed);
    filteredProducts = filteredProducts.filter((product) => product.clockSpeed === clockSpeedFilter);
  }

  if (name) {
    filteredProducts = filteredProducts.filter((product) => product.name.toLowerCase().includes(name.toLowerCase()));
  }

  const paginatedProducts = filteredProducts.slice(start, end + 1);

  res.status(200).json(paginatedProducts);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
