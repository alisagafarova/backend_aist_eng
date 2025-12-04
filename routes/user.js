import express from 'express';
import {
  registerValidation,
  loginValidation,
  validateSaveProgress,
} from '../validations/validations.js';
import { UserController } from '../controllers/index.js';
import { checkAuth, handleValidationErrors } from '../utils/index.js';

const router = express.Router();

// Routes for authentication
router.post('/register', registerValidation, handleValidationErrors, UserController.register);
router.post('/login', loginValidation, handleValidationErrors, UserController.login);
router.get('/me', checkAuth, UserController.getMe);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);
router.post('/last-page', checkAuth, UserController.updateLastVisitedPath);

// Routes for progress management
router.get('/progress', checkAuth, UserController.getProgress);
router.post('/progress', checkAuth, validateSaveProgress, UserController.saveProgress);

export default router;
