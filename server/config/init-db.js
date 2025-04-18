import pool from './db.js';
import bcrypt from 'bcrypt';

async function initializeDatabase() {
  try {
    // Create projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        progress DECIMAL(5,2) DEFAULT 0,
        dependencies VARCHAR(255),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create users table for admin authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Generate a fresh bcrypt hash for "admin123"
    const password = "admin123";
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`Generated new hash for default admin password: ${hashedPassword}`);
    
    // Insert default admin user with the fresh hash
    await pool.query(`
      INSERT IGNORE INTO users (username, password, is_admin)
      VALUES (?, ?, TRUE)
    `, ['admin', hashedPassword]);

    console.log('Database initialized successfully');
    
    // Verify the admin user was created with correct credentials
    const [adminUsers] = await pool.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (adminUsers.length > 0) {
      console.log('Admin user exists with ID:', adminUsers[0].id);
      
      // Verify password works
      const adminUser = adminUsers[0];
      const passwordVerification = await bcrypt.compare('admin123', adminUser.password);
      console.log(`Password verification result: ${passwordVerification ? 'SUCCESS' : 'FAILED'}`);
    } else {
      console.log('Warning: Admin user was not created successfully');
    }
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Run the initialization
initializeDatabase();

export { initializeDatabase }; 