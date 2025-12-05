import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User.js';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'listing_type'
  })
  listingType!: 'rent' | 'sale';

  @Column({
    type: 'varchar',
    length: 50,
    name: 'property_type'
  })
  propertyType!: string;

  @Column({
    type: 'varchar',
    length: 50
  })
  tenure!: 'freehold' | 'leasehold';

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'property_name'
  })
  propertyName?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'street_name'
  })
  streetName?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'city_name'
  })
  cityName?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  state?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true
  })
  county?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true
  })
  pincode?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  landmark?: string;

  @Column({
    type: 'numeric',
    precision: 15,
    scale: 2
  })
  price!: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'buildup_area'
  })
  buildupArea?: number;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true
  })
  furnishing?: 'Fully' | 'Partially' | 'Unfurnished';

  @Column({
    type: 'integer',
    nullable: true
  })
  bedrooms?: number;

  @Column({
    type: 'integer',
    nullable: true
  })
  bathrooms?: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  availability?: 'Immediate' | 'Next month' | 'Under Construction';

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'floor_level'
  })
  floorLevel?: string;

  @Column({
    type: 'integer',
    nullable: true,
    name: 'year_of_build'
  })
  yearOfBuild?: number;

  @Column({
    type: 'boolean',
    default: false
  })
  negotiable!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'swimming_pool'
  })
  swimmingPool!: boolean;

  @Column({
    type: 'boolean',
    default: false
  })
  gymnasium!: boolean;

  @Column({
    type: 'boolean',
    default: false
  })
  playground!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'bbq_area'
  })
  bbqArea!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'function_room'
  })
  functionRoom!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'games_room'
  })
  gamesRoom!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'sky_garden'
  })
  skyGarden!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'reading_room'
  })
  readingRoom!: boolean;

  @Column({
    type: 'boolean',
    default: false
  })
  lounge!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'covered_parking'
  })
  coveredParking!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'visitor_parking'
  })
  visitorParking!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'service_lift'
  })
  serviceLift!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'prayer_room'
  })
  prayerRoom!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'parcel_locker'
  })
  parcelLocker!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'laundry_room'
  })
  laundryRoom!: boolean;

  @Column({
    type: 'boolean',
    default: false
  })
  cafeteria!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'security_24h'
  })
  security24h!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'cctv_surveillance'
  })
  cctvSurveillance!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'access_card_system'
  })
  accessCardSystem!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'fire_alarm_system'
  })
  fireAlarmSystem!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    name: 'emergency_exit'
  })
  emergencyExit!: boolean;

  @Column({
    type: 'jsonb',
    nullable: true
  })
  images?: string[];

  @Column({
    type: 'varchar',
    length: 50,
    default: 'active'
  })
  status!: string;

  @Column({
    type: 'uuid',
    name: 'user_id'
  })
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at'
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at'
  })
  updatedAt!: Date;
}
