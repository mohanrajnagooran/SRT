import express from 'express';
import {getAllPlaces, createPlace, getPlaceById, updatePlace, deletePlace} from '../controllers/placeController.js';

const router = express.Router();

router.post('/', createPlace);
router.get('/', getAllPlaces);
router.get('/:id', getPlaceById);
router.put('/:id', updatePlace);
router.patch('/:id', deletePlace);

export default router;
