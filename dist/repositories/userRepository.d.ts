import { User } from '../entities/User.js';
import { UserRepositoryData, ExistingUserCheck } from '../types/user.js';
export declare const createUser: (userData: UserRepositoryData) => Promise<User>;
export declare const findUserByEmail: (email: string) => Promise<User | null>;
export declare const findUserById: (id: number) => Promise<User | null>;
export declare const findUserByUsername: (username: string) => Promise<User | null>;
export declare const findUserByPhoneNumber: (phoneNumber: string) => Promise<User | null>;
export declare const checkUserExists: (username: string, email: string, phoneNumber?: string) => Promise<ExistingUserCheck | null>;
export declare const updateLastLogin: (userId: number) => Promise<void>;
export declare const verifyUserEmail: (verificationToken: string) => Promise<User | null>;
export declare const updateUserEmailVerification: (userId: number) => Promise<User>;
export declare const getUsersByEmail: (email: string) => Promise<User[]>;
export declare const deleteUser: (userId: number) => Promise<void>;
export declare const updateUser: (userId: number, updates: Partial<User>) => Promise<User>;
//# sourceMappingURL=userRepository.d.ts.map