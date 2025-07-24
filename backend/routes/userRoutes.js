import express from 'express';
import { getVerifiedUsers } from '../controllers/authController.js';

const router = express.Router();

// Use the correct function from controller
router.get('/verified', getVerifiedUsers);

export default router;
