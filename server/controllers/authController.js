import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// Login user
const login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body.username);
    const { username, password } = req.body;
    
    // Simple validation
    if (!username || !password) {
      console.log('Login failed: Missing username or password');
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    
    // Check if user exists
    const user = await User.getByUsername(username);
    if (!user) {
      console.log('Login failed: User not found -', username);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Login failed: Invalid password for user -', username);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user.id, username: user.username, is_admin: user.is_admin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    console.log('Login successful:', username);
    
    // Send response with token and user info
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          is_admin: user.is_admin
        }
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    console.log('Getting current user for ID:', req.user.id);
    const userId = req.user.id;
    const user = await User.getById(userId);
    
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    console.log('User found:', user.username);
    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user', error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Simple validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password and new password are required' 
      });
    }
    
    // Get user with password
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = rows[0];
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    const success = await User.updatePassword(userId, hashedPassword);
    
    if (success) {
      res.json({ success: true, message: 'Password changed successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Failed to change password' });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Failed to change password', error: error.message });
  }
}; 

export { login, getCurrentUser, changePassword };