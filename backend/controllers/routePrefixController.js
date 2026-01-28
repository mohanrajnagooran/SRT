import db from "../config/db.js";

export const createRoutePrefix = async (req, res) => {
  const {
    source_place_id,
    destination_place_id,
    route_name,
    distance_km,
    remarks,
    place_ids, // ordered array
  } = req.body;
  //   console.log("Received data:", place_ids);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Get prefix
    const [sourceRow] = await connection.execute(
      "SELECT place FROM places_list WHERE id = ?",
      [source_place_id]
    );
    const [destRow] = await connection.execute(
      "SELECT place FROM places_list WHERE id = ?",
      [destination_place_id]
    );
    const sourcePrefix = sourceRow[0]?.place?.slice(0, 3).toUpperCase();
    const destPrefix = destRow[0]?.place?.slice(0, 3).toUpperCase();

    const [existing] = await connection.execute(
      "SELECT COUNT(*) as count FROM route_prefix WHERE prefix_code LIKE ?",
      [`${sourcePrefix}-${destPrefix}-%`]
    );
    const count = existing[0].count + 1;
    const prefix_code = `${sourcePrefix}-${destPrefix}-${count}`;

    // 2. Insert into route_prefix
    const [routeResult] = await connection.execute(
      `INSERT INTO route_prefix (source_place_id, destination_place_id, route_name, prefix_code, distance_km, remarks)
     VALUES (?, ?, ?, ?, ?, ?)`,
      [
        source_place_id,
        destination_place_id,
        route_name,
        prefix_code,
        distance_km,
        remarks,
      ]
    );
    const routeId = routeResult.insertId;

    //   console.log("Received place_ids:", place_ids);
    if (!Array.isArray(place_ids) || place_ids.length === 0) {
      return res
        .status(400)
        .json({ error: "place_ids must be a non-empty array" });
    }
    // 3. Insert into route_place
    for (let i = 0; i < place_ids.length; i++) {
      await connection.execute(
        "INSERT INTO route_place (route_id, place_id, place_order) VALUES (?, ?, ?)",
        [routeId, place_ids[i], i + 1]
      );
    }

    // 4. Update prefix in places_list
    for (let pid of place_ids) {
      const [p] = await connection.execute(
        "SELECT prefix FROM places_list WHERE id = ?",
        [pid]
      );
      const existingPrefixes = p[0]?.prefix || "";
      const updatedPrefixes = existingPrefixes
        ? `${existingPrefixes},${prefix_code}`
        : prefix_code;
      await connection.execute(
        "UPDATE places_list SET prefix = ? WHERE id = ?",
        [updatedPrefixes, pid]
      );
    }

    await connection.commit();
    connection.release();
    res.json({ success: true, prefix_code });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Route creation failed:", err);
    res.status(500).json({ error: "Failed to create route prefix" });
  }
};

// GET /api/route-prefixes
// export const getAllRoutePrefixes = async (req, res) => {
//   try {
//     // 1. Fetch all routes with source & destination names
//     const [routes] = await db.execute(`
//       SELECT
//         rp.id,
//         rp.prefix_code,
//         rp.route_name,
//         rp.distance_km,
//         rp.remarks,
//         sp.place AS source_place,
//         dp.place AS destination_place
//       FROM route_prefix rp
//       JOIN places_list sp ON rp.source_place_id = sp.id
//       JOIN places_list dp ON rp.destination_place_id = dp.id
//       ORDER BY rp.prefix_code
//     `);

//     // 2. For each route, fetch its ordered places
//     for (let route of routes) {
//       const [places] = await db.execute(
//         `SELECT rp.place_id, pl.place, rp.place_order
//          FROM route_place rp
//          JOIN places_list pl ON rp.place_id = pl.id
//          WHERE rp.route_id = ?
//          ORDER BY rp.place_order ASC`,
//         [route.id]
//       );
//       route.places = places; // attach ordered places list
//     }

//     res.json(routes);
//   } catch (err) {
//     console.error("Error fetching route prefixes:", err);
//     res.status(500).json({ error: "Failed to fetch route prefixes" });
//   }
// };
// GET /api/route-prefixes
export const getAllRoutePrefixes = async (req, res) => {
  const connection = await db.getConnection(); // pooled connection
  try {
    await connection.beginTransaction();

    const [rows] = await connection.execute(`
      SELECT 
        rp.id,
        rp.prefix_code,
        rp.route_name,
        rp.distance_km,
        rp.remarks,
        rp.source_place_id,
        rp.destination_place_id,
        pl.place AS destination_place
      FROM route_prefix rp
      LEFT JOIN places_list pl 
        ON rp.destination_place_id = pl.id
      WHERE rp.is_deleted = 0
      ORDER BY rp.prefix_code
    `);

    await connection.commit();
    res.json(rows);
  } catch (err) {
    await connection.rollback();
    console.error("Error fetching route prefixes:", err);
    res.status(500).json({ error: "Failed to fetch route prefixes" });
  } finally {
    connection.release();
  }
};



// GET routes for consignee place match
export const getRoutePrefixesByPlace = async (req, res) => {
  const placeString = req.query.placeName;
  const [placeName] = placeString.split(" - ");
  console.log("placeName query param:", placeName);

  if (!placeName) {
    return res.status(400).json({ error: "placeName query param is required" });
  }

  const sql = `
    SELECT
      rp.id,
      rp.prefix_code,
      rp.route_name,
      GROUP_CONCAT(pl.place ORDER BY rppl.place_order SEPARATOR ', ') AS places
    FROM route_prefix rp
    JOIN route_place rppl ON rppl.route_id = rp.id
    JOIN places_list pl ON pl.id = rppl.place_id
    GROUP BY rp.id, rp.prefix_code, rp.route_name
    HAVING SUM(CASE WHEN LOWER(pl.place) = LOWER(?) THEN 1 ELSE 0 END) > 0
  `;

  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(sql, [placeName]);

    const result = rows.map((row) => ({
      id: row.id,
      prefix_code: row.prefix_code,
      route_name: row.route_name,
      places: row.places.split(", ").map((p) => p.trim()),
    }));

    connection.release();
    res.json(result);
  } catch (error) {
    connection.release();
    console.error("Error fetching route prefixes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get by id
// GET /api/route-prefixes/:id
export const getRoutePrefixById = async (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      rp.id,
      rp.source_place_id,
      rp.destination_place_id,
      rp.route_name,
      rp.prefix_code,
      rp.distance_km,
      rp.remarks,
      rp.created_at,
      sp.place AS source_place_name,
      dp.place AS destination_place_name,
      pl.id AS intermediate_place_id,
      pl.place AS intermediate_place_name,
      rppl.place_order
    FROM route_prefix rp
    JOIN places_list sp ON rp.source_place_id = sp.id
    JOIN places_list dp ON rp.destination_place_id = dp.id
    LEFT JOIN route_place rppl ON rppl.route_id = rp.id
    LEFT JOIN places_list pl ON pl.id = rppl.place_id
    WHERE rp.id = ?
    ORDER BY rppl.place_order
  `;

  try {
    const [rows] = await db.execute(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Route prefix not found" });
    }

    // Take base route data from first row
    const route = {
      id: rows[0].id,
      source_place_id: rows[0].source_place_id,
      destination_place_id: rows[0].destination_place_id,
      route_name: rows[0].route_name,
      prefix_code: rows[0].prefix_code,
      distance_km: rows[0].distance_km,
      remarks: rows[0].remarks,
      created_at: rows[0].created_at,
      source_place_name: rows[0].source_place_name,
      destination_place_name: rows[0].destination_place_name,
      intermediate_places: rows
        .filter((r) => r.intermediate_place_id !== null)
        .map((r) => ({
          id: r.intermediate_place_id,
          name: r.intermediate_place_name,
          order: r.place_order,
        })),
    };

    res.json(route);
  } catch (err) {
    console.error("Error fetching route prefix by id:", err);
    res.status(500).json({ error: "Failed to fetch route prefix" });
  }
};

// PUT /api/route-prefixes/:id
export const updateRoutePrefix = async (req, res) => {
  const { id } = req.params;
  const {
    source_place_id,
    destination_place_id,
    route_name,
    distance_km,
    remarks,
    place_ids, // ordered array
  } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Update route prefix table
    await connection.execute(
      `UPDATE route_prefix 
       SET source_place_id=?, destination_place_id=?, route_name=?, distance_km=?, remarks=? 
       WHERE id=?`,
      [
        source_place_id,
        destination_place_id,
        route_name,
        distance_km,
        remarks,
        id,
      ]
    );

    // Remove existing route_place mappings
    await connection.execute("DELETE FROM route_place WHERE route_id = ?", [
      id,
    ]);

    // Insert new route_place mappings
    for (let i = 0; i < place_ids.length; i++) {
      await connection.execute(
        "INSERT INTO route_place (route_id, place_id, place_order) VALUES (?, ?, ?)",
        [id, place_ids[i], i + 1]
      );
    }

    await connection.commit();
    connection.release();

    res.json({ success: true, message: "Route prefix updated successfully" });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Error updating route prefix:", err);
    res.status(500).json({ error: "Failed to update route prefix" });
  }
};

// DELETE /api/route-prefixes/:id
export const deleteRoutePrefix = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  console.log("Deleting Route Prefix with ID:", id);

  try {
    await db.execute(
      `UPDATE route_prefix SET
            is_deleted = ?,
            delete_reason = ?,
            deleted_at = ?
          WHERE ID = ?`,
      [1, reason, new Date().toISOString().slice(0, 19).replace("T", " "), id]
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to soft delete" });
  }
};
// const connection = await db.getConnection();
// try {
//   await connection.beginTransaction();

//   // Delete route_place entries first
//   await connection.execute("DELETE FROM route_place WHERE route_id = ?", [id]);

//   // Delete route_prefix
//   await connection.execute("DELETE FROM route_prefix WHERE id = ?", [id]);

//   await connection.commit();
//   connection.release();

//   res.json({ success: true, message: "Route prefix deleted successfully" });
// } catch (err) {
//   await connection.rollback();
//   connection.release();
//   console.error("Error deleting route prefix:", err);
//   res.status(500).json({ error: "Failed to delete route prefix" });
// }
