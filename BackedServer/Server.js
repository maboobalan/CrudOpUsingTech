const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
//const Product = require('./Model/ConDB');

dotenv.config();

const app = express();
const port = process.env.PORT || 3200;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/PNListAndPPList';

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<div><h1>Hello Welcome</h1></div>');
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

const transactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rate: { type: Number, required: true },
  quantity: { type: Number, required: true },
  taxPercentage: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  grossTotal: { type: Number, required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.get('/api/transactions', async (req, res) => {
  try {
    const products = await Transaction.find();
    res.json(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/api/transactions', async (req, res) => {
  const { name, quantity, rate, taxPercentage, taxAmount, grossTotal } = req.body;

  const transaction = new Transaction({
    name,
    quantity,
    rate,
    taxPercentage,
    taxAmount,
    grossTotal,
  });

  try {
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/transactions/:id', async (req, res) => {
  try {
    const product = await Transaction.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/transactions/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rate: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;