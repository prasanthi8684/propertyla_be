import { RegistrationData, LoginCredentials, AuthToken, UserProfile } from '../types/user.js';
export declare const registerUser: (registrationData: RegistrationData) => Promise<{
    userId: any;
    username: any;
    email: any;
    emailVerified: any;
}>;
export declare const loginUser: (credentials: LoginCredentials) => Promise<AuthToken>;
export declare const verifyUserEmailToken: (token: string) => Promise<{
    id: any;
    emailVerified: any;
}>;
export declare const getUserProfile: (userId: number) => Promise<UserProfile>;
export declare const validateToken: (userId: number) => Promise<UserProfile>;
//# sourceMappingURL=authService.d.ts.map