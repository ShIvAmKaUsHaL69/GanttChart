import pool  from '../config/db.js';

class User {
  // Get a user by username
  static async getByUsername(username) {
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get a user by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT id, username, is_admin, created_at FROM users WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new user
  static async create(userData) {
    try {
      const { username, password, is_admin } = userData;
      const [result] = await pool.query(
        'INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)',
        [username, password, is_admin || false]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update user password
  static async updatePassword(id, newPassword) {
    try {
      const [result] = await pool.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [newPassword, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default User; 