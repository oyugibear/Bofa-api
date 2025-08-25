const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../errors/app-error');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        console.log('Auth Header:', authHeader ? 'Present' : 'Missing');
        console.log('Token:', token ? 'Present' : 'Missing');

        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({
                status: false,
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            console.log('❌ User not found for token');
            return res.status(401).json({
                status: false,
                message: 'Invalid token - user not found'
            });
        }

        console.log('✅ Auth successful for user:', user.email);
        req.user = user;
        next();
    } catch (error) {
        console.log('❌ Auth error:', error.message);
        return res.status(403).json({
            status: false,
            message: 'Invalid or expired token'
        });
    }
};

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: false,
                message: 'Access denied - insufficient permissions'
            });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRole
};
