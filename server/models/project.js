import pool from '../config/db.js';

class Project {
  // Get all projects
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a single project by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new project
  static async create(projectData) {
    try {
      const { name, description, start_date, end_date } = projectData;
      const [result] = await pool.query(
        'INSERT INTO projects (name, description, start_date, end_date) VALUES (?, ?, ?, ?)',
        [name, description, start_date, end_date]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update a project
  static async update(id, projectData) {
    try {
      const { name, description, start_date, end_date } = projectData;
      const [result] = await pool.query(
        'UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?',
        [name, description, start_date, end_date, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete a project
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default Project; 