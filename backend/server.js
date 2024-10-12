// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/cad_layout_generator', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Layout = require('./models/Layout');

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
app.get('/api/layouts', async (req, res) => {
  try {
    const layouts = await Layout.find();
    res.json(layouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/layouts/:id', async (req, res) => {
  try {
    const layout = await Layout.findById(req.params.id);
    if (!layout) return res.status(404).json({ message: 'Layout not found' });
    res.json(layout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/layouts', async (req, res) => {
  const layout = new Layout(req.body);
  try {
    const newLayout = await layout.save();
    res.status(201).json(newLayout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/layouts/:id', async (req, res) => {
  try {
    const updatedLayout = await Layout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLayout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/layouts/:id', async (req, res) => {
  try {
    await Layout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Layout deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

