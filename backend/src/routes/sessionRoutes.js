import express from 'express';
import {protectRoute} from '../middleware/protectRoute.js'
import { createSession, endSession, getActiveSession, getMyTRecentSession, getSessionByID, joinSession } from '../controllers/sessionController.js';
const router = express.Router();
router.post('/',createSession )
router.get('/active',getActiveSession)
router.get('/my-recent',getMyTRecentSession)
router.get('/:id',getSessionByID)
router.post('/:id/join',joinSession)
router.post('/:id/end',endSession)
export const sessionRoutes = router;