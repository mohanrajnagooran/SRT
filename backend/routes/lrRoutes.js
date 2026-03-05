import express from 'express';
import {getAllLr, getLrById, createLr, updateLr, deleteLr,getLRReport} from '../controllers/lrController.js';

const router = express.Router();


router.get('/report', getLRReport);


router.post('/', createLr);
router.get('/', getAllLr);
router.get('/:id', getLrById);
router.put('/:id', updateLr);
router.patch('/:id', deleteLr); 

export default router;
