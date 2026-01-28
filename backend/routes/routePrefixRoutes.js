import express from 'express';
import { createRoutePrefix, getAllRoutePrefixes, getRoutePrefixesByPlace, updateRoutePrefix, getRoutePrefixById, deleteRoutePrefix } from '../controllers/routePrefixController.js';

const router = express.Router();

router.post('/', createRoutePrefix);
router.get('/', getAllRoutePrefixes)
router.get('/by-place', getRoutePrefixesByPlace);
router.get("/:id", getRoutePrefixById);
router.put("/:id", updateRoutePrefix);
router.patch("/:id", deleteRoutePrefix);

export default router;