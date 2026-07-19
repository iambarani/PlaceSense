import express from 'express';
import {
    getStudentProfile,
    updateStudentProfile
} from '../controllers/studentController.js';

const router = express.Router();

// Student APIs
router.get('/:id', getStudentProfile);
router.post('/:id', updateStudentProfile);

export default router;