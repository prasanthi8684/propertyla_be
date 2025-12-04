import { query } from '../config/database.js';

export const createUser = async (userData) => {
  const { username, email, phoneNumber, passwordHash, verificationToken, verificationExpiry } = userData;

  const result = await query(
    `INSERT INTO users (username, email, phone_number, password_hash, verification_token, verification_expiry)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, username, email, phone_number, email_verified, created_at, updated_at`,
    [username, email, phoneNumber || null, passwordHash, verificationToken, verificationExpiry]
  );

  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await query(
    'SELECT id, email, password_hash, email_verified, username, phone_number FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0] || null;
};

export const findUserById = async (id) => {
  const result = await query(
    'SELECT id, username, email, phone_number, email_verified, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
};

export const findUserByUsername = async (username) => {
  const result = await query(
    'SELECT id, username, email FROM users WHERE username = $1',
    [username]
  );

  return result.rows[0] || null;
};

export const findUserByPhoneNumber = async (phoneNumber) => {
  const result = await query(
    'SELECT id, phone_number FROM users WHERE phone_number = $1',
    [phoneNumber]
  );

  return result.rows[0] || null;
};

export const checkUserExists = async (username, email, phoneNumber) => {
  const result = await query(
    `SELECT id, username, email, phone_number FROM users
     WHERE username = $1 OR email = $2 OR ($3 IS NOT NULL AND phone_number = $3)`,
    [username, email, phoneNumber]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const existingUser = result.rows[0];
  return {
    usernameExists: existingUser.username === username,
    emailExists: existingUser.email === email,
    phoneExists: phoneNumber && existingUser.phone_number === phoneNumber
  };
};

export const updateLastLogin = async (userId) => {
  await query(
    'UPDATE users SET last_login = NOW() WHERE id = $1',
    [userId]
  );
};

export const verifyUserEmail = async (verificationToken) => {
  const result = await query(
    'SELECT id, verification_expiry FROM users WHERE verification_token = $1',
    [verificationToken]
  );

  return result.rows[0] || null;
};

export const updateUserEmailVerification = async (userId) => {
  const result = await query(
    'UPDATE users SET email_verified = true, verification_token = NULL, verification_expiry = NULL WHERE id = $1 RETURNING id, email_verified',
    [userId]
  );

  return result.rows[0];
};

export const getUsersByEmail = async (email) => {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return result.rows;
};
