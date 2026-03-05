import pool from "../config/db.js"; // Your MySQL pool config



// report
export const getLRReport = async (req, res) => {
  try {
    const { date } = req.query;

    const [rows] = await pool.query(
      `SELECT 
        ID,
        prefix,
        consigner,
        consignee,
        consignee_place,
        bale_no,
        articles_count AS qty,
        paid,
        to_pay,
        r_paid,
        date
      FROM lr
      WHERE DATE(date) = ?
      AND is_deleted = 0`,
      [date]
    );

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Create a LR entry
export const createLr = async (req, res) => {
  const {
    article,
    billingType,
    amount,
    lrno,
    prefix,
    consigner,
    consignee,
    paid,
    crossing,
    date,
    travel_code,
    consigner_place,
    consignee_place,
    total,
    priority,
    bale_no,
    consigner_id,
    consignee_id,
    maatral_set,
    delivered,
    id_only_no,
    include_unloading_charges,
    is_unpaid,
    is_cancelled,
    from_transport,
    from_transport_id,
  } = req.body;

  try {
    // Generate accounting year from date
    const accounting_year = date ? new Date(date).getFullYear().toString() : null;

    // ✅ Generate LR ID safely using MAX in MySQL
    if (!prefix) {
      return res.status(400).json({ error: "Prefix is required to generate LR number." });
    }

   const basePrefix = prefix; 

// Find the maximum sub-number for this prefix
const [rowsMax] = await db.execute(
  `SELECT MAX(CAST(SUBSTRING_INDEX(ID, '-', -1) AS UNSIGNED)) AS maxNum
   FROM lr
   WHERE ID LIKE CONCAT(?, '-%') COLLATE utf8mb4_unicode_ci`,
  [basePrefix]
);

let nextNumber = (rowsMax[0].maxNum || 0) + 1;
let newId = `${basePrefix}-${nextNumber}`;

// Safety check for race conditions
const [checkExisting] = await db.execute(`SELECT 1 FROM lr WHERE ID = ?`, [newId]);
if (checkExisting.length > 0) {
  nextNumber++;
  newId = `${basePrefix}-${nextNumber}`;
}

console.log("Generated new ID:", newId);

    const values = [
      newId, // ID
      prefix, // prefix
      consigner || null,
      consignee || null,
      paid ? parseFloat(paid) : 0, // paid
      billingType === "Paid" ? "Paid" : "ToPay", // to_pay
      billingType === "Paid" ? parseFloat(paid || 0) : 0, // r_paid
      crossing || null,
      date || null,
      accounting_year || null,
      travel_code || null,
      consigner_place || null,
      consignee_place || null,
      total || null,
      priority || null,
      bale_no || null,
      Array.isArray(article) ? article.reduce((sum, a) => sum + Number(a.count || 0), 0) : 0, // articles_count
      consigner_id || null,
      consignee_id || null,
      maatral_set || null,
      delivered || null,
      id_only_no || null,
      include_unloading_charges === "true" ? "true" : "false",
      is_cancelled === "true" ? 1 : 0,
      is_unpaid === "true" ? 1 : 0,
      from_transport_id || null,
      from_transport || null
    ];

    console.log("Creating LR with values:", values);

    // Insert LR
    const [result] = await db.execute(
      `INSERT INTO lr (
        ID, prefix, consigner, consignee, paid, to_pay, r_paid,
        crossing, date, accounting_year, travel_code,
        consigner_place, consignee_place, total, priority,
        bale_no, articles_count, consigner_id, consignee_id,
        maatral_set, delivered, id_only_no, include_unloading_charges,
        is_cancelled, is_unpaid, from_transport_id, from_transport
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      values
    );

    // Fetch inserted LR
    const [rows] = await db.execute("SELECT * FROM lr WHERE ID = ?", [newId]);

    // Insert LR articles
    if (Array.isArray(article)) {
      for (const item of article) {
        const qty = parseFloat(item.count || 0);
        const rate = parseFloat(item.final_rate || 0);
        const kooli = parseFloat(item.final_kooli || 0);
        const price = rate * qty;

        await db.execute(
          `INSERT INTO lr_mp (billno, qty, product_name, rate, price, product_id, kooli)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            newId,
            qty,
            item.article_name || "",
            rate,
            price,
            item.article_id,
            kooli
          ]
        );
      }
    }

    // Fetch inserted articles
    const [articles] = await db.execute(`SELECT * FROM lr_mp WHERE billno = ?`, [newId]);

    res.status(201).json({
      message: "LR created successfully",
      lr: rows[0],
      articles: articles
    });

  } catch (err) {
    console.error("LR creation error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all Lr
// export const getAllLr = async (req, res) => {
//   try {
//     const [rows] = await db.execute(
//       "SELECT * FROM lr ORDER BY ID DESC"
//     );
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// export const getAllLr = async (req, res) => {
//   const {
//     page = 1,
//     limit = 10,
//     search = '',
//     is_cancelled,
//     is_unpaid,
//      sortBy = 'ID',
//       sortOrder = 'DESC',
//   } = req.query;

//   const offset = (page - 1) * limit;

//   try {
//     const values = [];
//     const filters = [];

//      // Always exclude soft-deleted customers
//     filters.push(`is_deleted = 0`);

//     // Search
//    if (search) {
//       filters.push(`(ID LIKE ? OR consigner LIKE ? OR consignee LIKE ?)`);
//       values.push(`%${search}%`, `%${search}%`, `%${search}%`);
//     }

//     // Filters
//     if (is_cancelled !== undefined && is_cancelled !== '') {
//       filters.push(`is_cancelled = ?`);
//       values.push(is_cancelled);
//     }
    
//     if (is_unpaid !== undefined && is_unpaid !== '') {
//       filters.push(`is_unpaid = ?`);
//       values.push(is_unpaid);
//     }

//     const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

//      const [data] = await db.execute(
//       `SELECT * FROM lr ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`,
//       [...values, Number(limit), Number(offset)]
//     );
//     const [countResult] = await db.execute(
//       `SELECT COUNT(*) as count FROM lr ${whereClause}`,
//       values
//     );
//     const totalCount = countResult[0].count;
//     const totalPages = Math.ceil(totalCount / limit);

//     res.json({
//       data,
//       page: Number(page),
//       totalPages,
//       totalCount
//     });
//   } catch (err) {
//     console.error("Error fetching LRs:", err);
//     res.status(500).json({ error: err.message });
//   }
// };
export const getAllLr = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    is_cancelled,
    is_unpaid,
    sortBy = 'ID',
    sortOrder = 'DESC',
  } = req.query;

  const offset = (page - 1) * limit;

  try {
    const values = [];
    const filters = [];

    // Always exclude soft-deleted
    filters.push(`is_deleted = 0`);

    if (search) {
      filters.push(`(ID LIKE ? OR consigner LIKE ? OR consignee LIKE ?)`);
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (is_cancelled !== undefined && is_cancelled !== '') {
      filters.push(`is_cancelled = ?`);
      values.push(is_cancelled);
    }

    if (is_unpaid !== undefined && is_unpaid !== '') {
      filters.push(`is_unpaid = ?`);
      values.push(is_unpaid);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    // 1. Fetch LRs
    const [lrData] = await db.execute(
      `SELECT * FROM lr ${whereClause} ORDER BY ${sortBy} ${sortOrder} LIMIT ? OFFSET ?`,
      [...values, Number(limit), Number(offset)]
    );

    // 2. Get total count
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as count FROM lr ${whereClause}`,
      values
    );
    const totalCount = countResult[0].count;
    const totalPages = Math.ceil(totalCount / limit);

    // 3. Fetch articles (lr_mp) for these LRs
    const lrIds = lrData.map(lr => lr.ID);
    let articleMap = {};

    if (lrIds.length > 0) {
      const placeholders = lrIds.map(() => '?').join(',');
      const [articles] = await db.execute(
        `SELECT * FROM lr_mp WHERE billno IN (${placeholders})`,
        lrIds
      );

      // 4. Group articles by billno (LR ID)
      articleMap = articles.reduce((acc, item) => {
        if (!acc[item.billno]) acc[item.billno] = [];
        acc[item.billno].push(item);
        return acc;
      }, {});
    }

    // 5. Attach articles to LRs
    const dataWithArticles = lrData.map(lr => ({
      ...lr,
      articles: articleMap[lr.ID] || [],
    }));

    res.json({
      data: dataWithArticles,
      page: Number(page),
      totalPages,
      totalCount,
    });

  } catch (err) {
    console.error("Error fetching LRs:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get Lr by ID
// export const getLrById = async (req, res) => {
//   try {
//     const [rows] = await db.execute("SELECT * FROM lr WHERE ID = ?", [
//       req.params.id,
//     ]);
//     if (rows.length === 0)
//       return res.status(404).json({ error: "Lr not found" });
//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
export const getLrById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM lr WHERE ID = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "LR not found" });
    }

    const lr = rows[0];

    // 🔍 Fetch related articles from lr_mp
    const [articles] = await db.execute(
      "SELECT * FROM lr_mp WHERE billno = ?",
      [req.params.id]
    );

    res.json({
      ...lr,
      article: articles || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update place
export const updateLr = async (req, res) => {
  const { id } = req.params;
  const {
    article,
    billingType,
    amount,
    lrno,
    prefix,
    consigner,
    consignee,
    paid,
    crossing,
    date,
    travel_code,
    consigner_place,
    consignee_place,
    total,
    priority,
    bale_no,
    consigner_id,
    consignee_id,
    maatral_set,
    delivered,
    id_only_no,
    include_unloading_charges,
    is_unpaid,
    is_cancelled,
    from_transport,
    from_transport_id,
  } = req.body;

  console.log("Update Article data:", req.body);

  try {
    const accounting_year = date ? new Date(date).getFullYear().toString() : null;
    const values = [
      prefix,
      consigner || null,
      consignee || null,
      paid ? parseFloat(paid) : 0,
      billingType === "Paid" ? "Paid" : "ToPay",
      billingType === "Paid" ? parseFloat(paid || 0) : 0,
      crossing || null,
      date || null,
      accounting_year || null,
      travel_code || null,
      consigner_place || null,
      consignee_place || null,
      total || null,
      priority || null,
      bale_no || null,
      Array.isArray(article) ? article.length : 0,
      consigner_id || null,
      consignee_id || null,
      maatral_set || null,
      delivered || null,
      id_only_no || null,
      include_unloading_charges === "true" ? "true" : "false",
      is_cancelled === "true" ? 1 : 0,
      is_unpaid === "true" ? 1 : 0,
      from_transport_id || null,
      from_transport || null,
      id // for WHERE clause
    ];
    const [result] = await db.execute(
      `UPDATE lr SET
        prefix = ?, consigner = ?, consignee = ?, paid = ?, to_pay = ?, r_paid = ?,
        crossing = ?, date = ?, accounting_year = ?, travel_code = ?,
        consigner_place = ?, consignee_place = ?, total = ?, priority = ?,
        bale_no = ?, articles_count = ?, consigner_id = ?, consignee_id = ?,
        maatral_set = ?, delivered = ?, id_only_no = ?, include_unloading_charges = ?,
        is_cancelled = ?, is_unpaid = ?, from_transport_id = ?, from_transport = ?
      WHERE ID = ?`,
      values
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "LR not found" });
    }

    const [rows] = await db.execute("SELECT * FROM lr WHERE ID = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Delete customer
export const deleteLr = async (req, res) => {
  const { reason } = req.body;
  const { id } = req.params;
  console.log("Deleting LR with ID:", id);
  try {
      await db.execute(
        `UPDATE lr SET
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
  //   const [result] = await db.execute("DELETE FROM lr WHERE ID = ?", [
  //     id,
  //   ]);

  //   if (result.affectedRows === 0) {
  //     return res.status(404).json({ error: "lr not found" });
  //   }

  //   res.json({ message: "lr deleted successfully" });
  //   console.log("LR deleted successfully with ID:", id);
    
  // } catch (err) {
  //   console.error("Delete error:", err);
  //   res.status(500).json({ error: err.message });
  // }
};
