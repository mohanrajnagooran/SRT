import express from 'express';
import multer from 'multer';
import path from 'path';
import db from '../config/db.js'; 



// Add new transaction
export const  createTransaction = async (req, res) => {
  try {
    const {
      type, amount, date, category, description,
      paymentMethod, cardNumber, expiryDate, cvv,
      accountNumber, routingNumber, bankName, transactionId
    } = req.body;

    const receiptFile = req.file ? req.file.filename : null;

    const values = [
      type, amount, date, category, description, paymentMethod,
      cardNumber, expiryDate, cvv,
      accountNumber, routingNumber, bankName,
      transactionId, receiptFile
    ];

    await db.execute(`
      INSERT INTO transactions (
        type, amount, date, category, description, payment_method,
        card_number, expiry_date, cvv,
        account_number, routing_number, bank_name,
        transaction_id, receipt_filename
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, values);

    res.status(201).json({ message: 'Transaction added successfully' });
  } catch (err) {
    console.error('Transaction insert error:', err);
    res.status(500).json({ error: err.message });
  }
};


// get all transaction
export const getAllTransactions = async (req, res) => {
  try {
    const [rows] = await db.execute(
  'SELECT * FROM transactions WHERE is_deleted = 0 ORDER BY date DESC'
);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching transactions:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Soft delete transaction

export const softDeleteTransaction = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ error: 'Delete reason is required' });
  }

  try {
    const [result] = await db.execute(
      `UPDATE transactions 
       SET is_deleted = 1, deleted_at = NOW(), delete_reason = ? 
       WHERE id = ? AND is_deleted = 0`,
      [reason, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Transaction not found or already deleted' });
    }

    res.json({ message: 'Transaction soft deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};