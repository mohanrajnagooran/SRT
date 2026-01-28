import express from 'express';
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getAllCustomersByPage
} from '../controllers/customerController.js';

const router = express.Router();

router.post('/', createCustomer);
router.get('/page', getAllCustomers);
router.get('/', getAllCustomersByPage);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer);
router.patch('/:id', deleteCustomer);


export default router;
