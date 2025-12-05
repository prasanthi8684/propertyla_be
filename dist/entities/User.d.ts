export declare class User {
    id: number;
    username: string;
    email: string;
    phoneNumber: string | null;
    passwordHash: string;
    emailVerified: boolean;
    verificationToken: string | null;
    verificationExpiry: Date | null;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    toJSON(): {
        id: number;
        username: string;
        email: string;
        phoneNumber: string | null;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    toProfileJSON(): {
        id: number;
        username: string;
        email: string;
        phoneNumber: string | null;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}
//# sourceMappingURL=User.d.ts.map