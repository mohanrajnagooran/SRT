import db from '../config/db.js'; // Your MySQL pool config
import { v4 as uuidv4 } from 'uuid';

// Create a customer
export const createCustomer = async (req, res) => {
  const {
    name,
    nametamil,
    place,
    placetamil,
    address,
    pincode,
    email,
    cgstno,
    sgstno,
    customer_type,
    prefix,
    primaryphonenumber,
    otherphonenumbers,
    sendsmsoptin,
    sendwhatsappoptin,
    whatsappnumber,
    place_id,
  } = req.body;

  console.log("Creating customer with data:", req.body);

  try {
    const [result] = await db.execute(
      `INSERT INTO customer (
        name, NameTamil, place, PlaceTamil,
        address, pincode, email, CGSTNo, SGSTNo,
        customer_type, prefix, PrimaryPhoneNumber,
        OtherPhoneNumbers, SendSMSOptIn, SendWhatsAppOptIn,
        WhatsAppNumber, Place_ID, CreatedAt, UpdatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name ?? null,
        nametamil ?? null,
        place ?? null,
        placetamil ?? null,
        address ?? null,
        pincode ?? null,
        email ?? null,
        cgstno ?? null,
        sgstno ?? null,
        customer_type ?? null,
        prefix ?? null,
        primaryphonenumber ?? null,
        JSON.stringify(otherphonenumbers ?? []),
        sendsmsoptin ?? false,
        sendwhatsappoptin ?? false,
        whatsappnumber ?? null,
        place_id ?? null
      ]
    );

    // ✅ Fetch newly created customer using auto-increment ID
    const [rows] = await db.execute('SELECT * FROM customer WHERE ID = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Customer creation error:', err);
    res.status(500).json({ error: err.message });
  }
};


// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM customer ORDER BY CreatedAt DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// pagination customers
export const getAllCustomersByPage = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    customer_type,
    sms,
    whatsapp,
    sortBy = 'id',
    sortOrder = 'DESC',
  } = req.query;
  console.log("Fetching customers with params:", req.query);
  

  const offset = (page - 1) * limit;

  try {
    const values = [];
    const filters = [];

    // Always exclude soft-deleted customers
    filters.push(`is_deleted = 0`);

    // Search
    if (search) {
      filters.push(`(id LIKE ? OR name LIKE ? OR place LIKE ?)`);
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Filters
    if (customer_type !== undefined && customer_type !== '') {
      filters.push(`customer_type = ?`);
      values.push(customer_type);
    }

    if (sms !== undefined && sms !== '') {
      filters.push(`SendSMSOptIn = ?`);
      values.push(sms);
    }

    if (whatsapp !== undefined && whatsapp !== '') {
      filters.push(`SendWhatsAppOptIn = ?`);
      values.push(whatsapp);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const [data] = await db.execute(
      `SELECT * FROM customer ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`,
      [...values, Number(limit), Number(offset)]
    );

    const [countResult] = await db.execute(
      `SELECT COUNT(*) as count FROM customer ${whereClause}`,
      values
    );

    const totalCount = countResult[0].count;
    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      data,
      page: Number(page),
      totalPages,
      totalCount
    });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM customer WHERE ID = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    nametamil,
    place,
    placetamil,
    address,
    pincode,
    email,
    cgstno,
    sgstno,
    customer_type,
    prefix,
    primaryphonenumber,
    sendsmsoptin,
    sendwhatsappoptin,
    whatsappnumber,
    place_id
  } = req.body;

  console.log("Update customer data:", req.body);

  try {
    const [result] = await db.execute(
      `UPDATE customer SET
        name = ?, nametamil = ?, place = ?, placetamil = ?,
        address = ?, pincode = ?, email = ?,
        cgstno = ?, sgstno = ?, customer_type = ?, prefix = ?,
        PrimaryPhoneNumber = ?, SendSMSOptIn = ?, SendWhatsAppOptIn = ?,
        WhatsAppNumber = ?, place_id = ?, UpdatedAt = NOW()
      WHERE ID = ?`,
      [
        name,
        nametamil,
        place,
        placetamil,
        address,
        pincode,
        email,
        cgstno,
        sgstno,
        customer_type,
        prefix,
        primaryphonenumber,
        sendsmsoptin ? 1 : 0,
        sendwhatsappoptin ? 1 : 0,
        whatsappnumber,
        place_id || null,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const [rows] = await db.execute("SELECT * FROM customer WHERE ID = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};



// Delete customer
export const deleteCustomer = async (req, res) => {
  const { reason } = req.body;
  const { id } = req.params;
  console.log("Deleting customer with ID:", id);
   
  try {
    await db.execute(
      `UPDATE customer SET
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
  //   const [result] = await db.execute('DELETE FROM customer WHERE ID = ?', [id]);

  //   if (result.affectedRows === 0) {
  //     return res.status(404).json({ error: 'Customer not found' });
  //   }

  //   res.json({ message: 'Customer deleted successfully' });
  // } catch (err) {
  //   console.error("Delete error:", err);
  //   res.status(500).json({ error: err.message });
  // }
};

