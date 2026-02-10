import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import * as userRepository from '../repositories/userRepository.js';
import { RegistrationData, LoginCredentials, AuthToken, UserProfile } from '../types/user.js';

const BCRYPT_SALT_ROUNDS = 10;
const VERIFICATION_TOKEN_EXPIRY_HOURS = 24;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

const JWT_SECRET: string = process.env.JWT_SECRET;

interface ServiceError {
  status: number;
  message: string;
}

const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

const generateJWTToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY } as SignOptions
  );
};

const calculateVerificationExpiry = (): Date => {
  return new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);
};

export const registerUser = async (registrationData: RegistrationData) => {
  const { username, email, phoneNumber, password } = registrationData;

  const existingUser = await userRepository.checkUserExists(username, email, phoneNumber);

  if (existingUser) {
    if (existingUser.usernameExists) {
      throw {
        status: 400,
        message: 'Username already exists'
      } as ServiceError;
    }
    if (existingUser.emailExists) {
      throw {
        status: 400,
        message: 'Email already exists'
      } as ServiceError;
    }
    if (existingUser.phoneExists) {
      throw {
        status: 400,
        message: 'Phone number already exists'
      } as ServiceError;
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

export const loginUser = async (credentials: LoginCredentials): Promise<AuthToken> => {
  const { email, password } = credentials;

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw {
      status: 401,
      message: 'Invalid email or password'
    } as ServiceError;
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    throw {
      status: 401,
      message: 'Invalid email or password'
    } as ServiceError;
  }

  if (!user.emailVerified) {
    throw {
      status: 403,
      message: 'Please verify your email before logging in'
    } as ServiceError;
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

export const verifyUserEmailToken = async (token: string) => {
  if (!token) {
    throw {
      status: 400,
      message: 'Verification token required'
    } as ServiceError;
  }

  const user = await userRepository.verifyUserEmail(token);

  if (!user) {
    throw {
      status: 400,
      message: 'Invalid verification token'
    } as ServiceError;
  }

  if (user.verificationExpiry && new Date() > new Date(user.verificationExpiry)) {
    throw {
      status: 400,
      message: 'Verification token has expired'
    } as ServiceError;
  }

  const updatedUser = await userRepository.updateUserEmailVerification(user.id);

  return {
    id: updatedUser.id,
    emailVerified: updatedUser.emailVerified
  };
};

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw {
      status: 403,
      message: 'User not found'
    } as ServiceError;
  }

  return user;
};

export const validateToken = async (userId: string): Promise<UserProfile> => {
  const user = await userRepository.findUserById(userId);
  console.log(user)
  if (!user) {
    throw {
      status: 403,
      message: 'Invalid token or user not found'
    } as ServiceError;
  }

  return user;
};
