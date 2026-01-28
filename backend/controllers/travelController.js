import db from "../config/db.js";

// travelController.js
export const getNextTravelCode = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { prefix } = req.params;

    const [rows] = await connection.execute(
      "SELECT travel_code FROM travel WHERE prefix = ? ORDER BY id DESC LIMIT 1",
      [prefix]
    );

    let newCode;
    if (rows.length === 0) {
      newCode = `${prefix}-1`;
    } else {
      const lastCode = rows[0].travel_code; // e.g. ERO-TRI-1-2
      const parts = lastCode.split("-");
      let lastNum = parseInt(parts[parts.length - 1], 10);

      if (isNaN(lastNum)) {
        lastNum = 0;
      }

      parts[parts.length - 1] = (lastNum + 1).toString();
      newCode = parts.join("-");
    }

    await connection.commit();
    res.json({ travel_code: newCode });
  } catch (err) {
    await connection.rollback();
    console.error("Error fetching next travel code:", err);
    res.status(500).json({ error: "Failed to fetch next travel code" });
  } finally {
    connection.release();
  }
};



export const createTravel = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      travel_code,
      prefix,
      travel_date,
      place_id,
      vehicle_id,
      driver_id,
      kattu_kooli,
      open_km,
    } = req.body;

    if (!travel_code || !prefix || !travel_date || !place_id) {
      await connection.rollback();
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Derive year from travel_date
    const year = new Date(travel_date).getFullYear();

    // Default values
    const status = "Created";
    const assign_status = "Open";

    const [result] = await connection.execute(
      `INSERT INTO travel 
        (travel_code, prefix, travel_date, year, place_id, vehicle_id, driver_id, 
         kattu_kooli, open_km, status, assign_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        travel_code,
        prefix,
        travel_date,
        year,
        place_id,
        vehicle_id,
        driver_id,
        kattu_kooli,
        open_km,
        status,
        assign_status,
      ]
    );

    await connection.commit();

    res.status(201).json({
      message: "Travel created successfully",
      id: result.insertId,
      travel_code,
    });
  } catch (err) {
    await connection.rollback();
    console.error("Error creating travel:", err);
    res.status(500).json({ error: "Failed to create travel" });
  } finally {
    connection.release();
  }
};


export const getAllTravels = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(`
      SELECT 
         t.id, 
         t.travel_code, 
         t.prefix, 
         t.travel_date, 
         t.status,
         p.place AS place_name,
         d.name AS driver_name,
         v.vehicle_no
       FROM travel t
       LEFT JOIN places_list p ON t.place_id = p.id
       LEFT JOIN driver d ON t.driver_id = d.id
       LEFT JOIN vehicle v ON t.vehicle_id = v.id
       ORDER BY t.created_at DESC
    `);

    await connection.commit();
    res.json(rows);
  } catch (err) {
    await connection.rollback();
    console.error("Error fetching travels:", err);
    res.status(500).json({ error: "Failed to fetch travels" });
  } finally {
    connection.release();
  }
};


// All LRs without travel assignment (not cancelled, not deleted)
export const getUnassignedLRs = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { prefix } = req.query;

    let query = `
      SELECT id, prefix, consigner, consignee, consigner_place, consignee_place,
             articles_count, travel_code
      FROM lr
      WHERE (travel_code IS NULL OR travel_code = '')
        AND is_deleted = 0
        AND is_cancelled = 0
    `;

    const params = [];

    if (prefix) {
      query += ` AND prefix = ?`;
      params.push(prefix);
    }

    query += ` ORDER BY id DESC`;

    const [rows] = await connection.execute(query, params);

    await connection.commit();
    res.json(rows);
  } catch (err) {
    await connection.rollback();
    console.error("Error fetching LRs:", err);
    res.status(500).json({ error: "Failed to fetch LRs" });
  } finally {
    connection.release();
  }
};



// controllers/travelController.js
export const assignLRsToTravel = async (req, res) => {
  const connection = await db.getConnection(); // get pooled connection
  try {
    const { travelCode, lrIds } = req.body;
    if (!travelCode || !lrIds || lrIds.length === 0) {
      return res.status(400).json({ error: "Invalid request" });
    }

    await connection.beginTransaction();

    // 1. Update LR table with travel code
    const placeholders = lrIds.map(() => "?").join(",");
    const sql = `UPDATE lr SET travel_code = ? WHERE id IN (${placeholders})`;
    await connection.execute(sql, [travelCode, ...lrIds]);

    // 2. Update Travel table (status -> InProgress, assign_status -> Closed)
    await connection.execute(
      `UPDATE travel 
       SET status = 'InProgress', assign_status = 'Closed'
       WHERE travel_code = ?`,
      [travelCode]
    );

    await connection.commit();
    res.json({ success: true, message: "LRs assigned and Travel updated successfully" });
  } catch (err) {
    await connection.rollback();
    console.error("Error assigning LRs:", err);
    res.status(500).json({ error: "Failed to assign LRs" });
  } finally {
    connection.release();
  }
};


export const getTravelCodes = async (req, res) => {
   const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { prefix } = req.query;

    let query = `
      SELECT travel_code, prefix, travel_date, status
      FROM travel
      WHERE status NOT IN ('Cancelled', 'InProgress', 'Completed')
    `;
    
    const params = [];

    if (prefix) {
      query += ` AND prefix = ?`;
      params.push(prefix);
    }

    query += ` ORDER BY id DESC`;

    const [rows] = await connection.execute(query, params);
    // console.log(rows);
    
    await connection.commit();
    res.json(rows);
  } catch (err) {
    await connection.rollback();
    console.error("Error fetching travel codes:", err);
    res.status(500).json({ error: "Failed to fetch travel codes" });
  }finally {
    connection.release();
  }
};

export const getInProgressTravelCodes = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      `SELECT id, travel_code, status
       FROM travel
       WHERE status = 'InProgress'
       ORDER BY id DESC`
    );

    await connection.commit();
    res.json(rows);
  } catch (err) {
    await connection.rollback();
    console.error("Error fetching InProgress travel codes:", err);
    res.status(500).json({ error: "Failed to fetch InProgress travel codes" });
  } finally {
    connection.release();
  }
};


export const updateTravelExpenses = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params; // travel id
    const {
      lorryRent,
      unloadCharges,
      kattuKooli,
      dieselCharges,
      dieselQty,
      otherCharges,
      maintenanceCharges,
      driverSalary,
      closeKm,
      totalKm,
      mileage,
    } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Travel ID is required" });
    }

    await connection.beginTransaction();

    const [result] = await connection.execute(
      `UPDATE travel 
       SET 
         lorry_rent = ?, 
         unload_charges = ?, 
         kattu_kooli = ?, 
         diesel_charges = ?, 
         diesel_qty = ?, 
         other_charges = ?, 
         maintenance_charges = ?, 
         driver_salary = ?, 
         close_km = ?, 
         total_km = ?, 
         mileage = ?, 
         status = 'Completed',
         completed_at = NOW(),
         updated_at = NOW()
       WHERE id = ? AND status = 'InProgress'`,
      [
        lorryRent || 0,
        unloadCharges || 0,
        kattuKooli || 0,
        dieselCharges || 0,
        dieselQty || 0,
        otherCharges || 0,
        maintenanceCharges || 0,
        driverSalary || 0,
        closeKm || 0,
        totalKm || 0,
        mileage || 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ error: "Travel not found or not in progress" });
    }

    await connection.commit();
    res.json({ message: "Travel marked as Completed with expenses updated" });
  } catch (err) {
    await connection.rollback();
    console.error("Error updating travel expenses:", err);
    res.status(500).json({ error: "Failed to update travel expenses" });
  } finally {
    connection.release();
  }
};