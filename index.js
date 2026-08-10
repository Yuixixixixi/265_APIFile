const express = require('express');
const app = express();
const port = 3000;
const db = require('./models');

// 1. Import router dari routes/api.js
const apiRouter = require('./routes/api');

// 2. Middleware parser untuk JSON dan URL-encoded request body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 3. Pasang router dengan prefix '/api'
// Ini yang menghubungkan endpoint seperti /api/register dan /api/komik
app.use('/api', apiRouter);

// 4. Sinkronisasi database Sequelize & Jalankan Server
db.sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });