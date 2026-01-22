
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


const ADMIN_PASSWORD = "nisha";

app.get('/api/menu', (req, res) => {
  fs.readFile('menu.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send("Error reading data");
    res.json(JSON.parse(data));
  });
});

app.post('/api/menu', (req, res) => {
  const { password, newMenu } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Wrong Password!" });
  }
  fs.writeFile('menu.json', JSON.stringify(newMenu, null, 2), err => {
    if (err) return res.status(500).json({ success: false, message: "Save failed" });
    res.json({ success: true, message: "Menu Updated Successfully!" });
  });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
