require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const placeRoutes = require('./routes/places');
const metaRoutes = require('./routes/meta');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/meta', metaRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
