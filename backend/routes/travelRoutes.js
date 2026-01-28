import express from 'express';
import { getNextTravelCode, getInProgressTravelCodes, updateTravelExpenses, createTravel, getAllTravels, getUnassignedLRs, assignLRsToTravel, getTravelCodes } from '../controllers/travelController.js';

const router = express.Router();
router.post("/", createTravel);
router.get("/", getAllTravels);
router.get("/lrs/unassigned", getUnassignedLRs);
router.post("/assign", assignLRsToTravel);
router.get("/travel-codes", getTravelCodes);
router.get("/travel-codes/inprogress", getInProgressTravelCodes);
router.get("/next-code/:prefix", getNextTravelCode);
router.put("/:id/expenses", updateTravelExpenses);




export default router;