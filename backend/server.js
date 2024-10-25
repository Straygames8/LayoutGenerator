// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const net = require('net');

const app = express();

// Log the MongoDB URI to confirm it’s loaded correctly
console.log("MongoDB URI:", process.env.MONGODB_URI);

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const Layout = require('./models/Layout');

// Modified file upload configuration for Render
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Your routes
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Function to find an available port
const findAvailablePort = (startPort) => {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        
        server.listen(startPort, () => {
            const port = server.address().port;
            server.close(() => {
                resolve(port);
            });
        });
        
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                findAvailablePort(startPort + 1).then(resolve, reject);
            } else {
                reject(err);
            }
        });
    });
};

// Start server with dynamic port finding
const startServer = async () => {
    try {
        const port = await findAvailablePort(process.env.PORT || 3000);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

// Initialize the server
startServer();