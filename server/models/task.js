import pool  from '../config/db.js';

class Task {
  // Get all tasks
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM tasks ORDER BY project_id, start_date');
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get tasks by project ID
  static async getByProjectId(projectId) {
    try {
      const [rows] = await pool.query('SELECT * FROM tasks WHERE project_id = ? ORDER BY start_date', [projectId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get a single task by ID
  static async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create a new task
  static async create(taskData) {
    try {
      const { project_id, name, description, start_date, end_date, progress, dependencies } = taskData;
      const [result] = await pool.query(
        'INSERT INTO tasks (project_id, name, description, start_date, end_date, progress, dependencies) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [project_id, name, description, start_date, end_date, progress || 0, dependencies || '']
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update a task
  static async update(id, taskData) {
    try {
      const { name, description, start_date, end_date, progress, dependencies } = taskData;
      const [result] = await pool.query(
        'UPDATE tasks SET name = ?, description = ?, start_date = ?, end_date = ?, progress = ?, dependencies = ? WHERE id = ?',
        [name, description, start_date, end_date, progress, dependencies, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete a task
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete all tasks for a project
  static async deleteByProjectId(projectId) {
    try {
      const [result] = await pool.query('DELETE FROM tasks WHERE project_id = ?', [projectId]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

export default Task; 