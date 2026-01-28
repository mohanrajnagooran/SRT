import db from "../config/db.js";

export const getAllVehicles = async (req, res) => {
   try {
    const [rows] = await db.execute('SELECT id, vehicle_no, vehicle_name FROM vehicle');
    res.json(rows);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
}