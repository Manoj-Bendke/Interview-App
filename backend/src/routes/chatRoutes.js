import express from 'express';

const router = express.Router();

router.get('/token', getStreamToken)
export default router;