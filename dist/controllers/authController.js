import { validationResult } from 'express-validator';
import * as authService from '../services/authService.js';
export const register = async (req, res) => {
    console.log('Test this is the test route for auth controller');
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                errors: errors.array()
            });
            return;
        }
        const { username, email, phone_number, password } = req.body;
        const result = await authService.registerUser({
            username,
            email,
            phoneNumber: phone_number,
            password,
            otp: '123456'
        });
        res.status(201).json({
            success: true,
            message: 'Registration successful. Please check your email to verify your account.',
            data: result
        });
    }
    catch (error) {
        if (error.status) {
            res.status(error.status).json({
                success: false,
                message: error.message
            });
            return;
        }
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
export const login = async (req, res) => {
    console.log('Test this is the test route for auth controller');
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                errors: errors.array()
            });
            return;
        }
        const { email, password } = req.body;
        const result = await authService.loginUser({
            email,
            password
        });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });
    }
    catch (error) {
        if (error.status) {
            res.status(error.status).json({
                success: false,
                message: error.message
            });
            return;
        }
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
export const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                user: req.user
            }
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;
        const result = await authService.verifyUserEmailToken(token);
        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            data: result
        });
    }
    catch (error) {
        if (error.status) {
            res.status(error.status).json({
                success: false,
                message: error.message
            });
            return;
        }
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
export const verifyOTP = async (req, res) => {
    try {
        const { user_id, otp } = req.body;
        console.log('Received OTP verification request:', { user_id, otp });
        if (!user_id || !otp) {
            res.status(400).json({ error: 'User ID and OTP code are required' });
            return;
        }
        const result = await authService.verifyOTP(user_id, otp);
        res.status(200).json({
            message: 'OTP verified successfully. User is now verified.',
            user_id: result.userId,
            email: result.email,
            verified: result.emailVerified
        });
        return;
    }
    catch (error) {
        console.error('Verification error:', error.message);
        if (error.message === 'User not found' || error.message === 'Invalid or expired OTP') {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
//# sourceMappingURL=authController.js.map