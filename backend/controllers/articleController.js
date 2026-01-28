import db from "../config/db.js"; // Your MySQL pool config

// Create a Article
export const createArticle = async (req, res) => {
  const { name, rate, kooli, speed, tamil_name, unload_charges} = req.body;

  console.log("Creating Articles with data:", req.body);

  try {
    const [result] = await db.execute(
      `INSERT INTO articles (
        name, rate, kooli, speed, tamil_name, unload_charges
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, rate, kooli, speed, tamil_name, unload_charges]
    );

    // ✅ Fetch newly created customer using auto-increment ID
    const [rows] = await db.execute("SELECT * FROM articles WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Article creation error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all Article
export const getAllArticle = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM articles WHERE is_deleted = 0 ORDER BY ID DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ARTICAL by ID
export const getArticalById = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM articles WHERE ID = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Article not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update artical
export const updateArticle = async (req, res) => {
  const { id } = req.params;
  const {  name, rate, kooli, speed, tamil_name, unload_charges } = req.body;

  console.log("Update Article data:", req.body);

  try {
    const [result] = await db.execute(
      `UPDATE articles SET
         name = ?,
         rate = ?, 
         kooli = ?,
         speed = ?,
         tamil_name = ?,
         unload_charges = ?
       WHERE ID = ?`,
      [ name, rate, kooli, speed, tamil_name, unload_charges, id] // Correct order
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    const [rows] = await db.execute("SELECT * FROM articles WHERE ID = ?", [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Delete article
export const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  console.log("Deleting Articles with ID:", id);
  try {
      await db.execute(
        `UPDATE articles SET
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
  //   const [result] = await db.execute("DELETE FROM articles WHERE ID = ?", [
  //     id,
  //   ]);

  //   if (result.affectedRows === 0) {
  //     return res.status(404).json({ error: "Article not found" });
  //   }

  //   res.json({ message: "Article deleted successfully" });
  // } catch (err) {
  //   console.error("Delete error:", err);
  //   res.status(500).json({ error: err.message });
  // }
};

// Get customer wise article and default artical merge list
export const customerWIseArticle = async (req, res) => {
    const { customerId } = req.params;

    // Input validation for customerId
    if (isNaN(parseInt(customerId))) {
        return res.status(400).json({ message: 'Invalid Customer ID provided. Must be a number.' });
    }

    try {
        const [articles] = await db.execute(
            `SELECT
                a.ID AS article_id,
                a.name AS article_name,
                COALESCE(auw.rate, a.rate) AS final_rate,         -- Uses custom rate from articles_user_wise if available, else default from articles
                COALESCE(auw.customer_kooli, a.kooli) AS final_kooli, -- Uses custom kooli if available, else default
                COALESCE(auw.customer_speed, a.speed) AS final_speed, -- Uses custom speed if available, else default
                a.tamil_name,
                a.unload_charges AS unloadcharges                 -- Corrected column name from 'unload_chargestinyint' to 'unload_charges'
            FROM
                articles AS a                                     -- Corrected table name from 'article' to 'articles' (plural)
            LEFT JOIN
                articles_user_wise AS auw ON a.ID = auw.article_id
                AND auw.customer_id = ?`, // Parameterized query for customerId
            [customerId]
        );

        if (articles.length === 0) {
            return res.status(404).json({ message: `No articles found for customer ${customerId} or no articles exist.` });
        }

        res.json(articles); // Send the fetched articles as JSON
    } catch (error) {
        console.error(`Error fetching articles for customer ${customerId}:`, error);
        res.status(500).json({ message: `Error fetching articles for customer ${customerId}`, error: error.message });
    }
};