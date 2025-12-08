import express from 'express';
import {protectRoute} from '../middleware/protectRoute.js'
import { createSession, endSession, getActiveSession, getMyTRecentSession, getSessionByID, joinSession } from '../controllers/sessionController.js';
const router = express.Router();
router.post('/',protectRoute,createSession )
router.get('/active',protectRoute,getActiveSession)
router.get('/my-recen',protectRoute,getMyTRecentSession)
router.get('/:id',protectRoute,getSessionByID)
router.post('/:id/join',protectRoute,joinSession)
router.post('/:id/end',protectRoute,endSession)
export const sessionRoutes = router;