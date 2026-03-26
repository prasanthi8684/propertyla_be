import { RegistrationData, LoginCredentials, AuthToken, UserProfile } from '../types/user.js';
export declare const registerUser: (registrationData: RegistrationData) => Promise<{
    userId: string;
    username: string;
    email: string;
    emailVerified: boolean;
}>;
export declare const loginUser: (credentials: LoginCredentials) => Promise<AuthToken>;
export declare const verifyUserEmailToken: (token: string) => Promise<{
    id: string;
    emailVerified: boolean;
}>;
export declare const getUserProfile: (userId: string) => Promise<UserProfile>;
export declare const validateToken: (userId: string) => Promise<UserProfile>;
export declare const verifyOTP: (userId: string, code: string) => Promise<{
    userId: string;
    email: string;
    emailVerified: boolean;
}>;
//# sourceMappingURL=authService.d.ts.map