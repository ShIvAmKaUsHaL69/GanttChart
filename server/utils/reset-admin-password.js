import pool from '../config/db.js';
import bcrypt from 'bcrypt';

async function resetAdminPassword() {
  try {
    console.log('Starting admin password reset...');
    
    // Generate a fresh bcrypt hash for "admin123"
    const password = "admin123";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`Generated new hash for admin password: ${hashedPassword}`);
    
    // Update the admin user password
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE username = ?',
      [hashedPassword, 'admin']
    );
    
    if (result.affectedRows > 0) {
      console.log('Admin password updated successfully!');
      
      // Verify the password works
      const [adminUsers] = await pool.query('SELECT * FROM users WHERE username = ?', ['admin']);
      if (adminUsers.length > 0) {
        const adminUser = adminUsers[0];
        const passwordVerification = await bcrypt.compare('admin123', adminUser.password);
        console.log(`Password verification result: ${passwordVerification ? 'SUCCESS' : 'FAILED'}`);
      }
    } else {
      console.log('Admin user not found. Creating a new admin user...');
      
      // Insert new admin user
      const [insertResult] = await pool.query(
        'INSERT INTO users (username, password, is_admin) VALUES (?, ?, TRUE)',
        ['admin', hashedPassword]
      );
      
      if (insertResult.affectedRows > 0) {
        console.log('New admin user created successfully!');
      } else {
        console.log('Failed to create admin user');
      }
    }
    
    // Close the database connection
    await pool.end();
    
  } catch (error) {
    console.error('Error resetting admin password:', error);
    process.exit(1);
  }
}

// Run the function
resetAdminPassword(); 