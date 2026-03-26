import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, verifyEmail, verifyOTP } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();
router.post('/register', [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),
    body('phone_number')
        .optional()
        .trim()
        .matches(/^\+?[1-9]\d{1,14}$/)
        .withMessage('Invalid phone number format'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
], register);
router.post('/login', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
], login);
router.post('/verify-email', verifyEmail);
// Temporary placeholder for /verify-otp until authController exports verifyOtp
router.post('/verify-otp', verifyOTP);
router.get('/profile', authenticateToken, getProfile);
export default router;
//# sourceMappingURL=authRoutes.js.map