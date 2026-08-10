require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./models');

const app = express();
const port = process.env.PORT || 3000;

// pastikan folder uploads ada (multer tidak membuatnya otomatis)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const apiRouter = require('./routes/api');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadDir));
app.use('/api', apiRouter);

// handler error multer / fileFilter
app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ message: err.message });
  next();
});

db.sequelize.sync()
  .then(() => {
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch((err) => console.error('Failed to sync database:', err));
