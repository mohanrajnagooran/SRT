import express from 'express';
import multer from 'multer';
import path from 'path';
import { createTransaction, getAllTransactions, softDeleteTransaction} from '../controllers/transactionController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/receipts');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Get all transactions
router.get('/', getAllTransactions);
router.post('/', upload.single('receipt'), createTransaction);

router.patch('/:id/delete', softDeleteTransaction); // PATCH for soft delete



export default router;