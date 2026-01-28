import db from "../config/db.js";

// Get all drivers (not deleted)
export const getAllDrivers = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT id, name, license_no, mobile_no, address, proof
       FROM driver
       WHERE is_deleted = 0
       ORDER BY id DESC`
    );

    await connection.commit();
    res.json(rows);
  } catch (err) {
    await connection.rollback();
    console.error("Error fetching drivers:", err);
    res.status(500).json({ error: "Failed to fetch drivers" });
  } finally {
    connection.release();
  }
};

// Create driver
export const createDriver = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { name, license_no, mobile_no, address, proof } = req.body;

    const [result] = await connection.execute(
      `INSERT INTO driver (name, license_no, mobile_no, address, proof)
       VALUES (?, ?, ?, ?, ?)`,
      [name, license_no, mobile_no, address, proof]
    );

    await connection.commit();
    res.json({
      id: result.insertId,
      name,
      license_no,
      mobile_no,
      address,
      proof,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error creating driver:", err);
    res.status(500).json({ error: "Failed to create driver" });
  } finally {
    connection.release();
  }
};

// Update driver
export const updateDriver = async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const { id } = req.params;
    const { name, license_no, mobile_no, address, proof } = req.body;

    await connection.execute(
      `UPDATE driver 
       SET name = ?, license_no = ?, mobile_no = ?, address = ?, proof = ?, updated_at = NOW()
       WHERE id = ? AND is_deleted = 0`,
      [name, license_no, mobile_no, address, proof, id]
    );

    await connection.commit();
    res.json({ message: "Driver updated successfully" });
  } catch (err) {
    console.error("Error updating driver:", err);
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error("Rollback failed:", rollbackErr.message);
      }
    }
    res.status(500).json({ error: "Failed to update driver" });
  } finally {
    if (connection) connection.release();
  }
};


// Soft delete driver with reason
export const softDeleteDriver = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE driver 
       SET is_deleted = 1, deleted_reason = ?, deleted_at = NOW()
       WHERE id = ?`,
      [req.body.reason, req.params.id]
    );

    await connection.commit();
    res.json({ message: "Driver soft deleted successfully" });
  } catch (err) {
    await connection.rollback(); // ❌ this throws if connection already closed
    res.status(500).json({ error: "Failed to delete driver" });
  } finally {
    connection.release(); // maybe you release too early
  }
};
