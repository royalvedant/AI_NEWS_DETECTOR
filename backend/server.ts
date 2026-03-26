const express = require('express');
const cors = require('cors');
const { mockArticles } = require('./data/mock-articles');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/news', (req, res) => {
  res.json({ success: true, data: mockArticles });
});

app.listen(PORT, () => {
  console.log(`Legacy Node server running on port ${PORT}`);
});

module.exports = app;
