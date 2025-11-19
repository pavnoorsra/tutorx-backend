const express = require('express');
const cors = require('cors');
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send("Backend is running! 🚀");
});

// translate POST route
app.post('/translate', (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  // dummy translation
  const translated = text + " (translated ✔️)";
  res.json({ translated });
});

// render uses this port automatically
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
