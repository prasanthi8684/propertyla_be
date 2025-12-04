export const UserRole = {
  USER: 'user',
  ADMIN: 'admin'
};

export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

export class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.phoneNumber = data.phone_number;
    this.passwordHash = data.password_hash;
    this.emailVerified = data.email_verified;
    this.verificationToken = data.verification_token;
    this.verificationExpiry = data.verification_expiry;
    this.lastLogin = data.last_login;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      phoneNumber: this.phoneNumber,
      emailVerified: this.emailVerified,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toProfileJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      phoneNumber: this.phoneNumber,
      emailVerified: this.emailVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export class RegistrationRequest {
  constructor(data) {
    this.username = data.username;
    this.email = data.email;
    this.phoneNumber = data.phone_number;
    this.password = data.password;
  }
}

export class LoginRequest {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
  }
}

export class AuthResponse {
  constructor(data) {
    this.token = data.token;
    this.user = data.user;
    this.expiresIn = data.expiresIn;
  }
}
