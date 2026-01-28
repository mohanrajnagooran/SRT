import db from "../config/db.js"; // Your MySQL pool config

// Create a place
export const createPlace = async (req, res) => {
  const { district, place, pincode, state, prefixes } = req.body;

  console.log("Creating place with data:", req.body);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
     // Check if the place already exists (to avoid duplicates)
    const [existing] = await connection.execute(
      `SELECT id FROM places_list WHERE place = ? AND pincode = ? AND state = ? AND district = ?`,
      [place, pincode, state, district]
    );

    if (existing.length > 0) {
      // Place exists, respond with conflict status and avoid insertion
      await connection.rollback();
      connection.release();
      return res.status(409).json({ error: "Place already exists" });
    }

    // 1. Insert into places_list
    const [result] = await connection.execute(
      `INSERT INTO places_list (
        place, district, state, pincode, prefix
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        place,
        district,
        state,
        pincode,
        prefixes && prefixes.length > 0
          ? prefixes.map((p) => p.prefix).join(",")
          : null,
      ]
    );

    const placeId = result.insertId;

    // 2. Insert into route_place for each prefix with order
    if (Array.isArray(prefixes) && prefixes.length > 0) {
  for (const p of prefixes) {
    // 1. Get route_id
    const [route] = await connection.execute(
      "SELECT id FROM route_prefix WHERE prefix_code = ?",
      [p.prefix]
    );

    if (route.length > 0) {
      const routeId = route[0].id;

      // 2. Get existing places for this route, ordered
      const [existingPlaces] = await connection.execute(
        "SELECT id, place_id, place_order FROM route_place WHERE route_id = ? ORDER BY place_order ASC",
        [routeId]
      );

      // 3. Insert the new place into the desired position
      const orderRequested = parseInt(p.order) || existingPlaces.length + 1;

      // Add new place into array at correct position
      const updatedPlaces = [
        ...existingPlaces.map((ep) => ({ place_id: ep.place_id })),
      ];
      updatedPlaces.splice(orderRequested - 1, 0, { place_id: placeId });

      // 4. Delete old route_place
      await connection.execute("DELETE FROM route_place WHERE route_id = ?", [
        routeId,
      ]);

      // 5. Reinsert with sequential order numbers
      for (let i = 0; i < updatedPlaces.length; i++) {
        await connection.execute(
          "INSERT INTO route_place (route_id, place_id, place_order) VALUES (?, ?, ?)",
          [routeId, updatedPlaces[i].place_id, i + 1]
        );
      }
    }
  }
}


    await connection.commit();
    connection.release();

    // 3. Fetch newly created place
    const [rows] = await db.execute(
      "SELECT * FROM places_list WHERE id = ?",
      [placeId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("place creation error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get all places
export const getAllPlaces = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM places_list WHERE is_deleted = 0 ORDER BY place DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get place by ID
export const getPlaceById = async (req, res) => {
  try {
    // 1. Fetch base place info
    const [rows] = await db.execute(
      "SELECT * FROM places_list WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Place not found" });
    }

    const place = rows[0];

    // 2. Fetch related prefixes + order from route_place
    const [prefixes] = await db.execute(
      `SELECT rp.prefix_code AS prefix, rpl.place_order AS \`order\`
       FROM route_place rpl
       JOIN route_prefix rp ON rpl.route_id = rp.id
       WHERE rpl.place_id = ?
       ORDER BY rpl.place_order ASC`,
      [req.params.id]
    );

    // 3. Attach structured prefixes
    place.prefixes = prefixes;

    res.json(place);
  } catch (err) {
    console.error("Get place error:", err);
    res.status(500).json({ error: err.message });
  }
};



// Update place
export const updatePlace = async (req, res) => {
  const { id } = req.params;
  const { district, place, pincode, state, prefixes } = req.body;

  console.log("Update place data:", req.body);

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Update base place info
    await connection.execute(
      `UPDATE places_list SET
         place = ?,
         pincode = ?, 
         prefix = ?,   -- just comma separated string for reference
         district = ?,
         state = ?
       WHERE id = ?`,
      [
        place,
        pincode,
        prefixes && prefixes.length > 0
          ? prefixes.map((p) => p.prefix).join(",")
          : null,
        district,
        state,
        id,
      ]
    );

    // 2. For each prefix, update route_place
    if (Array.isArray(prefixes) && prefixes.length > 0) {
      for (const p of prefixes) {
        // Get route_id for this prefix
        const [route] = await connection.execute(
          "SELECT id FROM route_prefix WHERE prefix_code = ?",
          [p.prefix]
        );

        if (route.length > 0) {
          const routeId = route[0].id;

          // (a) Fetch all existing places for this route
          const [existingPlaces] = await connection.execute(
            "SELECT place_id FROM route_place WHERE route_id = ? AND place_id != ? ORDER BY place_order ASC",
            [routeId, id]
          );

          // (b) Insert the updated place into the correct position
          const orderRequested = parseInt(p.order) || existingPlaces.length + 1;

          const updatedPlaces = [
            ...existingPlaces.map((ep) => ({ place_id: ep.place_id })),
          ];
          updatedPlaces.splice(orderRequested - 1, 0, { place_id: id });

          // (c) Delete old rows for this route
          await connection.execute("DELETE FROM route_place WHERE route_id = ?", [
            routeId,
          ]);

          // (d) Reinsert with clean order numbers
          for (let i = 0; i < updatedPlaces.length; i++) {
            await connection.execute(
              "INSERT INTO route_place (route_id, place_id, place_order) VALUES (?, ?, ?)",
              [routeId, updatedPlaces[i].place_id, i + 1]
            );
          }
        }
      }
    }

    await connection.commit();
    connection.release();

    // 3. Fetch updated place
    const [rows] = await db.execute("SELECT * FROM places_list WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};



// Delete customer
export const deletePlace = async (req, res) => {
  const { reason } = req.body;
  const { id } = req.params;
  console.log("Deleting Place with ID:", id);
   try {
      await db.execute(
        `UPDATE places_list SET
          is_deleted = ?,
          deleted_reason = ?,
          deleted_at = ?
        WHERE ID = ?`,
        [
          1,
          reason,
          new Date().toISOString().slice(0, 19).replace('T', ' '),
          id
        ]);
      res.json({ success: true });
    } catch (error) {
      console.log(error);
      
      res.status(500).json({ error: 'Failed to soft delete' });
    }

  // try {
  //   const [result] = await db.execute("DELETE FROM places_list WHERE id = ?", [
  //     id,
  //   ]);

  //   if (result.affectedRows === 0) {
  //     return res.status(404).json({ error: "Place not found" });
  //   }

  //   res.json({ message: "Place deleted successfully" });
  // } catch (err) {
  //   console.error("Delete error:", err);
  //   res.status(500).json({ error: err.message });
  // }
};
