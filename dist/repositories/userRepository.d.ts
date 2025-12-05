import { UserRepositoryData, ExistingUserCheck } from '../types/user.js';
export declare const createUser: (userData: UserRepositoryData) => Promise<any>;
export declare const findUserByEmail: (email: string) => Promise<any>;
export declare const findUserById: (id: number) => Promise<any>;
export declare const findUserByUsername: (username: string) => Promise<any>;
export declare const findUserByPhoneNumber: (phoneNumber: string) => Promise<any>;
export declare const checkUserExists: (username: string, email: string, phoneNumber?: string) => Promise<ExistingUserCheck | null>;
export declare const updateLastLogin: (userId: number) => Promise<void>;
export declare const verifyUserEmail: (verificationToken: string) => Promise<any>;
export declare const updateUserEmailVerification: (userId: number) => Promise<any>;
export declare const getUsersByEmail: (email: string) => Promise<any[]>;
//# sourceMappingURL=userRepository.d.ts.map