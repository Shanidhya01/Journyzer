const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, preferences } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash, preferences });
    const token = signToken({ id: user._id, email: user.email, name: user.name });
    res.json({ user: { id: user._id, email: user.email, name: user.name }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = signToken({ id: user._id, email: user.email, name: user.name });
    res.json({ user: { id: user._id, email: user.email, name: user.name }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
