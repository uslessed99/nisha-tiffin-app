const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ✅ ROOT ROUTE (THIS FIXES "Cannot GET /")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API: Get Menu
app.get('/api/menu', (req, res) => {
  fs.readFile(path.join(__dirname, 'menu.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading menu' });
    }
    res.json(JSON.parse(data));
  });
});

// API: Update Menu
const ADMIN_PASSWORD = "nisha";

app.post('/api/menu', (req, res) => {
  const { password, newMenu } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Wrong Password' });
  }

  fs.writeFile(
    path.join(__dirname, 'menu.json'),
    JSON.stringify(newMenu, null, 2),
    err => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Save failed' });
      }
      res.json({ success: true });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
