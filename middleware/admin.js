

const requireAdmin = (req, res, next) => {
     if (req.user.role !== 'admin') {
          return res.status(403).json({ 
               message: 'Access denied. Admin role required.' 
          });
     }
     next();
}

export { requireAdmin };