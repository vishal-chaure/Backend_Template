import jwt from 'jsonwebtoken';

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

export { authenticateToken };