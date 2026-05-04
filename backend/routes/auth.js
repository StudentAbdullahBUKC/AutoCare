const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const auth = require('../middleware/auth');
const User = require('../models/User');

const jwtSign = promisify(jwt.sign);
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    // --- Input Validation ---
    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please provide name, email, and password.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters long.' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'An account with this email already exists.' });

        user = new User({ name, email, password, role: role || 'customer' });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id, role: user.role } };
        const token = await jwtSign(payload, JWT_SECRET, { expiresIn: '100h' });
        
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' })
           .json({ msg: 'Registered successfully', user: { id: user.id, name: user.name, role: user.role } });

    } catch (err) {
        console.error('Registration Error:', err.message);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ msg: messages.join(', ') });
        }
        res.status(500).json({ msg: err.message || 'Server error during registration.' });
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please provide email and password.' });
    }

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'No account found with that email address.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Incorrect password. Please try again.' });

        const payload = { user: { id: user.id, role: user.role } };
        const token = await jwtSign(payload, JWT_SECRET, { expiresIn: '100h' });

        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' })
           .json({ msg: 'Logged in successfully', user: { id: user.id, name: user.name, role: user.role } });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: err.message || 'Server error during login.' });
    }
});

// @route   GET api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found.' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error.' });
    }
});

// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, (req, res) => {
    res.clearCookie('token').json({ msg: 'Logged out successfully' });
});

module.exports = router;
