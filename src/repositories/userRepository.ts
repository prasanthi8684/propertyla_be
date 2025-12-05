import { AppDataSource } from '../config/database.js';
import { User } from '../entities/User.js';
import { UserRepositoryData, ExistingUserCheck } from '../types/user.js';
import { Repository } from 'typeorm';

let userRepository: Repository<User>;

const getUserRepository = (): Repository<User> => {
  if (!userRepository) {
    userRepository = AppDataSource.getRepository(User);
  }
  return userRepository;
};

export const createUser = async (userData: UserRepositoryData): Promise<User> => {
  const repository = getUserRepository();

  const user = repository.create({
    username: userData.username,
    email: userData.email,
    phoneNumber: userData.phoneNumber || null,
    passwordHash: userData.passwordHash,
    verificationToken: userData.verificationToken,
    verificationExpiry: userData.verificationExpiry,
    emailVerified: false
  });

  return await repository.save(user);
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const repository = getUserRepository();

  return await repository.findOne({
    where: { email },
    select: ['id', 'email', 'passwordHash', 'emailVerified', 'username', 'phoneNumber', 'createdAt', 'updatedAt']
  });
};

export const findUserById = async (id: number): Promise<User | null> => {
  const repository = getUserRepository();

  return await repository.findOne({
    where: { id },
    select: ['id', 'username', 'email', 'phoneNumber', 'emailVerified', 'createdAt', 'updatedAt']
  });
};

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const repository = getUserRepository();

  return await repository.findOne({
    where: { username },
    select: ['id', 'username', 'email']
  });
};

export const findUserByPhoneNumber = async (phoneNumber: string): Promise<User | null> => {
  const repository = getUserRepository();

  return await repository.findOne({
    where: { phoneNumber },
    select: ['id', 'phoneNumber']
  });
};

export const checkUserExists = async (
  username: string,
  email: string,
  phoneNumber?: string
): Promise<ExistingUserCheck | null> => {
  const repository = getUserRepository();

  const qb = repository.createQueryBuilder('user');

  qb.where('user.username = :username', { username })
    .orWhere('user.email = :email', { email });

  if (phoneNumber) {
    qb.orWhere('user.phoneNumber = :phoneNumber', { phoneNumber });
  }

  const existingUser = await qb.getOne();

  if (!existingUser) {
    return null;
  }

  return {
    usernameExists: existingUser.username === username,
    emailExists: existingUser.email === email,
    phoneExists: phoneNumber ? existingUser.phoneNumber === phoneNumber : false
  };
};

export const updateLastLogin = async (userId: number): Promise<void> => {
  const repository = getUserRepository();

  await repository.update(
    { id: userId },
    { lastLogin: new Date() }
  );
};

export const verifyUserEmail = async (verificationToken: string): Promise<User | null> => {
  const repository = getUserRepository();

  return await repository.findOne({
    where: { verificationToken },
    select: ['id', 'verificationExpiry']
  });
};

export const updateUserEmailVerification = async (userId: number): Promise<User> => {
  const repository = getUserRepository();

  await repository.update(
    { id: userId },
    {
      emailVerified: true,
      verificationToken: null,
      verificationExpiry: null
    }
  );

  const updatedUser = await repository.findOne({
    where: { id: userId }
  });

  if (!updatedUser) {
    throw new Error('User not found after update');
  }

  return updatedUser;
};

export const getUsersByEmail = async (email: string): Promise<User[]> => {
  const repository = getUserRepository();

  return await repository.find({
    where: { email }
  });
};

export const deleteUser = async (userId: number): Promise<void> => {
  const repository = getUserRepository();

  await repository.delete({ id: userId });
};

export const updateUser = async (userId: number, updates: Partial<User>): Promise<User> => {
  const repository = getUserRepository();

  await repository.update({ id: userId }, updates);

  const updatedUser = await repository.findOne({
    where: { id: userId }
  });

  if (!updatedUser) {
    throw new Error('User not found after update');
  }

  return updatedUser;
};
