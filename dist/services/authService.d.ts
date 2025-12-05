import { RegistrationData, LoginCredentials, AuthToken, UserProfile } from '../types/user.js';
export declare const registerUser: (registrationData: RegistrationData) => Promise<{
    userId: number;
    username: string;
    email: string;
    emailVerified: boolean;
}>;
export declare const loginUser: (credentials: LoginCredentials) => Promise<AuthToken>;
export declare const verifyUserEmailToken: (token: string) => Promise<{
    id: number;
    emailVerified: boolean;
}>;
export declare const getUserProfile: (userId: number) => Promise<UserProfile>;
export declare const validateToken: (userId: number) => Promise<UserProfile>;
//# sourceMappingURL=authService.d.ts.map