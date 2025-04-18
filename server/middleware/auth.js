import jwt  from 'jsonwebtoken';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
      
      // Set user object in request
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ success: false, message: 'Authentication error', error: error.message });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  // Check if user exists and is admin
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  
  next();
}; 

export { authenticateToken, requireAdmin };