import { AppDataSource } from '../config/database.js';
import { Property } from '../entities/Property.js';
import { FindOptionsWhere, ILike, MoreThanOrEqual, LessThanOrEqual, Equal } from 'typeorm';

export interface PropertyFilters {
  listingType?: 'rent' | 'sale';
  propertyType?: string;
  tenure?: 'freehold' | 'leasehold';
  furnishing?: 'Fully' | 'Partially' | 'Unfurnished';
  availability?: 'Immediate' | 'Next month' | 'Under Construction';
  cityName?: string;
  state?: string;
  status?: string;
  userId?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  minArea?: number;
  negotiable?: boolean;
  swimmingPool?: boolean;
  gymnasium?: boolean;
  coveredParking?: boolean;
  security24h?: boolean;
}

export const createProperty = async (propertyData: Partial<Property>): Promise<Property> => {
  const propertyRepository = AppDataSource.getRepository(Property);
  const property = propertyRepository.create(propertyData);
  return await propertyRepository.save(property);
};

export const findPropertyById = async (id: string): Promise<Property | null> => {
  const propertyRepository = AppDataSource.getRepository(Property);
  return await propertyRepository.findOne({
    where: { id }
  });
};

export const findAllProperties = async (filters?: PropertyFilters): Promise<Property[]> => {
  const propertyRepository = AppDataSource.getRepository(Property);
  const queryBuilder = propertyRepository.createQueryBuilder('property');

  if (filters) {
    if (filters.listingType) {
      queryBuilder.andWhere('property.listingType = :listingType', {
        listingType: filters.listingType
      });
    }

    if (filters.propertyType) {
      queryBuilder.andWhere('property.propertyType = :propertyType', {
        propertyType: filters.propertyType
      });
    }

    if (filters.tenure) {
      queryBuilder.andWhere('property.tenure = :tenure', { tenure: filters.tenure });
    }

    if (filters.furnishing) {
      queryBuilder.andWhere('property.furnishing = :furnishing', {
        furnishing: filters.furnishing
      });
    }

    if (filters.availability) {
      queryBuilder.andWhere('property.availability = :availability', {
        availability: filters.availability
      });
    }

    if (filters.cityName) {
      queryBuilder.andWhere('property.cityName ILIKE :cityName', {
        cityName: `%${filters.cityName}%`
      });
    }

    if (filters.state) {
      queryBuilder.andWhere('property.state ILIKE :state', {
        state: `%${filters.state}%`
      });
    }

    if (filters.status) {
      queryBuilder.andWhere('property.status = :status', { status: filters.status });
    }

    if (filters.userId) {
      queryBuilder.andWhere('property.userId = :userId', { userId: filters.userId });
    }

    if (filters.minPrice !== undefined) {
      queryBuilder.andWhere('property.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice !== undefined) {
      queryBuilder.andWhere('property.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    if (filters.minBedrooms !== undefined) {
      queryBuilder.andWhere('property.bedrooms >= :minBedrooms', {
        minBedrooms: filters.minBedrooms
      });
    }

    if (filters.maxBedrooms !== undefined) {
      queryBuilder.andWhere('property.bedrooms <= :maxBedrooms', {
        maxBedrooms: filters.maxBedrooms
      });
    }

    if (filters.minBathrooms !== undefined) {
      queryBuilder.andWhere('property.bathrooms >= :minBathrooms', {
        minBathrooms: filters.minBathrooms
      });
    }

    if (filters.minArea !== undefined) {
      queryBuilder.andWhere('property.buildupArea >= :minArea', { minArea: filters.minArea });
    }

    if (filters.negotiable !== undefined) {
      queryBuilder.andWhere('property.negotiable = :negotiable', {
        negotiable: filters.negotiable
      });
    }

    if (filters.swimmingPool !== undefined) {
      queryBuilder.andWhere('property.swimmingPool = :swimmingPool', {
        swimmingPool: filters.swimmingPool
      });
    }

    if (filters.gymnasium !== undefined) {
      queryBuilder.andWhere('property.gymnasium = :gymnasium', {
        gymnasium: filters.gymnasium
      });
    }

    if (filters.coveredParking !== undefined) {
      queryBuilder.andWhere('property.coveredParking = :coveredParking', {
        coveredParking: filters.coveredParking
      });
    }

    if (filters.security24h !== undefined) {
      queryBuilder.andWhere('property.security24h = :security24h', {
        security24h: filters.security24h
      });
    }
  }

  queryBuilder.orderBy('property.createdAt', 'DESC');

  return await queryBuilder.getMany();
};

export const findPropertiesByUserId = async (userId: string): Promise<Property[]> => {
  const propertyRepository = AppDataSource.getRepository(Property);
  return await propertyRepository.find({
    where: { userId },
    order: { createdAt: 'DESC' }
  });
};

export const updateProperty = async (
  id: string,
  updates: Partial<Property>
): Promise<Property | null> => {
  const propertyRepository = AppDataSource.getRepository(Property);
  await propertyRepository.update(id, updates);
  return await findPropertyById(id);
};

export const deleteProperty = async (id: string): Promise<void> => {
  const propertyRepository = AppDataSource.getRepository(Property);
  await propertyRepository.delete(id);
};

export const searchProperties = async (searchTerm: string): Promise<Property[]> => {
  const propertyRepository = AppDataSource.getRepository(Property);
  const queryBuilder = propertyRepository.createQueryBuilder('property');

  queryBuilder.where(
    '(property.title ILIKE :searchTerm OR ' +
    'property.description ILIKE :searchTerm OR ' +
    'property.cityName ILIKE :searchTerm OR ' +
    'property.streetName ILIKE :searchTerm OR ' +
    'property.landmark ILIKE :searchTerm)',
    { searchTerm: `%${searchTerm}%` }
  );

  queryBuilder.orderBy('property.createdAt', 'DESC');

  return await queryBuilder.getMany();
};

export const countPropertiesByUser = async (userId: string): Promise<number> => {
  const propertyRepository = AppDataSource.getRepository(Property);
  return await propertyRepository.count({
    where: { userId }
  });
};
