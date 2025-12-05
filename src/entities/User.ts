import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'phone_number' })
  phoneNumber: string | null;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'boolean', default: false, name: 'email_verified' })
  emailVerified: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'verification_token' })
  verificationToken: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'verification_expiry' })
  verificationExpiry: Date | null;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login' })
  lastLogin: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  toJSON() {
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
