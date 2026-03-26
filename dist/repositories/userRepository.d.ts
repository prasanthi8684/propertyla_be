import { User } from '../entities/User.js';
import { UserRepositoryData, ExistingUserCheck } from '../types/user.js';
export declare const findValidOTP: (userId: string, otp: string) => Promise<boolean>;
export declare const createUser: (userData: UserRepositoryData) => Promise<User>;
export declare const findUserByEmail: (email: string) => Promise<User | null>;
export declare const findUserById: (id: string) => Promise<User | null>;
export declare const findUserByUsername: (username: string) => Promise<User | null>;
export declare const findUserByPhoneNumber: (phoneNumber: string) => Promise<User | null>;
export declare const checkUserExists: (username: string, email: string, phoneNumber?: string) => Promise<ExistingUserCheck | null>;
export declare const updateLastLogin: (userId: string) => Promise<void>;
export declare const verifyUserEmail: (verificationToken: string) => Promise<User | null>;
export declare const updateUserEmailVerification: (userId: string) => Promise<User>;
export declare const getUsersByEmail: (email: string) => Promise<User[]>;
export declare const deleteUser: (userId: string) => Promise<void>;
export declare const updateUser: (userId: string, updates: Partial<User>) => Promise<User>;
//# sourceMappingURL=userRepository.d.ts.map