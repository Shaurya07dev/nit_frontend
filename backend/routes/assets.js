import express from 'express';
import pool from '../db.js';

const router = express.Router();

// GET /api/assets?sort=column&order=asc|desc&filter_column=col&filter_value=val&limit=10&offset=0
router.get('/', async (req, res) => {
  try {
    const { sort, order, filter_column, filter_value, limit = 50, offset = 0 } = req.query;
    let sql = 'SELECT * FROM assets';
    const params = [];
    if (filter_column && filter_value) {
      sql += ` WHERE \\\`${filter_column}\\\` = ?`;
      params.push(filter_value);
    }
    if (sort) {
      sql += ` ORDER BY \`${sort}\` ${order === 'desc' ? 'DESC' : 'ASC'}`;
    }
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/assets
router.post('/', async (req, res) => {
  try {
    const { year_of_purchase, item_name, quantity, inventory_number, room_number, floor_number, building_block, remarks, department_origin } = req.body;
    const [result] = await pool.query(
      `INSERT INTO assets (year_of_purchase, item_name, quantity, inventory_number, room_number, floor_number, building_block, remarks, department_origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [year_of_purchase, item_name, quantity, inventory_number, room_number, floor_number, building_block, remarks, department_origin]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/assets/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const setClause = Object.keys(fields).map(key => `\`${key}\` = ?`).join(', ');
    const values = Object.values(fields);
    values.push(id);
    const [result] = await pool.query(
      `UPDATE assets SET ${setClause} WHERE id = ?`,
      values
    );
    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/assets/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM assets WHERE id = ?', [id]);
    res.json({ affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;