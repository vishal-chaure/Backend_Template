import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

// Rate limiting for login attempts
const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5, // 5 attempts per window
     message: 'Too many login attempts, please try again later',
     handler: (req, res) => {
          res.status(429).json({
               status: 'error',
               message: 'Too many login attempts, please try again later',
               retryAfter: '15 minutes'
          });
     }
});

const authenticateToken = (req, res, next) => {
     const authHeader = req.headers['authorization'];
     const token = authHeader && authHeader.split(' ')[1];

     if (!token) {
          return res.status(401).json({ 
               message: 'Access denied. Not token provided.' 
          });
     }
     try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
          next();
     } catch (error) {
          return res.status(403).json({ 
               message: 'Invalid token.',
               error: error.message
          });
     }
}

export { authenticateToken , loginLimiter };