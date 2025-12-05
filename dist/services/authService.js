import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as userRepository from '../repositories/userRepository.js';
const BCRYPT_SALT_ROUNDS = 10;
const VERIFICATION_TOKEN_EXPIRY_HOURS = 24;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}
const JWT_SECRET = process.env.JWT_SECRET;
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};
const generateJWTToken = (userId, email) => {
    return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};
const calculateVerificationExpiry = () => {
    return new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
};
export const registerUser = async (registrationData) => {
    const { username, email, phoneNumber, password } = registrationData;
    const existingUser = await userRepository.checkUserExists(username, email, phoneNumber);
    if (existingUser) {
        if (existingUser.usernameExists) {
            throw {
                status: 400,
                message: 'Username already exists'
            };
        }
        if (existingUser.emailExists) {
            throw {
                status: 400,
                message: 'Email already exists'
            };
        }
        if (existingUser.phoneExists) {
            throw {
                status: 400,
                message: 'Phone number already exists'
            };
        }
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const verificationToken = generateVerificationToken();
    const verificationExpiry = calculateVerificationExpiry();
    const newUser = await userRepository.createUser({
        username,
        email,
        phoneNumber,
        passwordHash,
        verificationToken,
        verificationExpiry
    });
    return {
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        emailVerified: newUser.emailVerified
    };
};
export const loginUser = async (credentials) => {
    const { email, password } = credentials;
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw {
            status: 401,
            message: 'Invalid email or password'
        };
    }
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
        throw {
            status: 401,
            message: 'Invalid email or password'
        };
    }
    if (!user.emailVerified) {
        throw {
            status: 403,
            message: 'Please verify your email before logging in'
        };
    }
    await userRepository.updateLastLogin(user.id);
    const token = generateJWTToken(user.id, user.email);
    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    };
};
export const verifyUserEmailToken = async (token) => {
    if (!token) {
        throw {
            status: 400,
            message: 'Verification token required'
        };
    }
    const user = await userRepository.verifyUserEmail(token);
    if (!user) {
        throw {
            status: 400,
            message: 'Invalid verification token'
        };
    }
    if (user.verificationExpiry && new Date() > new Date(user.verificationExpiry)) {
        throw {
            status: 400,
            message: 'Verification token has expired'
        };
    }
    const updatedUser = await userRepository.updateUserEmailVerification(user.id);
    return {
        id: updatedUser.id,
        emailVerified: updatedUser.emailVerified
    };
};
export const getUserProfile = async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw {
            status: 403,
            message: 'User not found'
        };
    }
    return user;
};
export const validateToken = async (userId) => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw {
            status: 403,
            message: 'Invalid token or user not found'
        };
    }
    return user;
};
//# sourceMappingURL=authService.js.map