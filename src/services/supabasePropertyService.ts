import * as propertyRepository from '../repositories/supabasePropertyRepository.js';
import { Property, PropertyFilters, CreatePropertyData } from '../repositories/supabasePropertyRepository.js';

interface ServiceError {
  status: number;
  message: string;
}

const validatePropertyData = (data: Partial<CreatePropertyData>): void => {
  if (data.title && data.title.trim().length === 0) {
    throw {
      status: 400,
      message: 'Title cannot be empty'
    } as ServiceError;
  }

  if (data.title && data.title.length > 255) {
    throw {
      status: 400,
      message: 'Title cannot exceed 255 characters'
    } as ServiceError;
  }

  if (data.description && data.description.trim().length === 0) {
    throw {
      status: 400,
      message: 'Description cannot be empty'
    } as ServiceError;
  }

  if (data.listing_type && !['rent', 'sale'].includes(data.listing_type)) {
    throw {
      status: 400,
      message: 'Listing type must be either "rent" or "sale"'
    } as ServiceError;
  }

  if (data.tenure && !['freehold', 'leasehold'].includes(data.tenure)) {
    throw {
      status: 400,
      message: 'Tenure must be either "freehold" or "leasehold"'
    } as ServiceError;
  }

  if (data.furnishing && !['Fully', 'Partially', 'Unfurnished'].includes(data.furnishing)) {
    throw {
      status: 400,
      message: 'Furnishing must be "Fully", "Partially", or "Unfurnished"'
    } as ServiceError;
  }

  if (data.availability && !['Immediate', 'Next month', 'Under Construction'].includes(data.availability)) {
    throw {
      status: 400,
      message: 'Availability must be "Immediate", "Next month", or "Under Construction"'
    } as ServiceError;
  }

  if (data.price !== undefined && data.price < 0) {
    throw {
      status: 400,
      message: 'Price cannot be negative'
    } as ServiceError;
  }

  if (data.buildup_area !== undefined && data.buildup_area < 0) {
    throw {
      status: 400,
      message: 'Buildup area cannot be negative'
    } as ServiceError;
  }

  if (data.bedrooms !== undefined && (data.bedrooms < 0 || !Number.isInteger(data.bedrooms))) {
    throw {
      status: 400,
      message: 'Bedrooms must be a non-negative integer'
    } as ServiceError;
  }

  if (data.bathrooms !== undefined && (data.bathrooms < 0 || !Number.isInteger(data.bathrooms))) {
    throw {
      status: 400,
      message: 'Bathrooms must be a non-negative integer'
    } as ServiceError;
  }

  if (data.year_of_build !== undefined) {
    const currentYear = new Date().getFullYear();
    if (data.year_of_build < 1800 || data.year_of_build > currentYear + 5) {
      throw {
        status: 400,
        message: `Year of build must be between 1800 and ${currentYear + 5}`
      } as ServiceError;
    }
  }

  if (data.pincode && !/^[0-9A-Za-z\s-]{3,20}$/.test(data.pincode)) {
    throw {
      status: 400,
      message: 'Invalid pincode format'
    } as ServiceError;
  }

  if (data.images && data.images.length > 10) {
    throw {
      status: 400,
      message: 'Maximum 10 images allowed'
    } as ServiceError;
  }
};

export const createProperty = async (propertyData: CreatePropertyData): Promise<Property> => {
  if (!propertyData.title || propertyData.title.trim().length === 0) {
    throw {
      status: 400,
      message: 'Title is required'
    } as ServiceError;
  }

  if (!propertyData.description || propertyData.description.trim().length === 0) {
    throw {
      status: 400,
      message: 'Description is required'
    } as ServiceError;
  }

  if (!propertyData.price || propertyData.price <= 0) {
    throw {
      status: 400,
      message: 'Price is required and must be greater than 0'
    } as ServiceError;
  }

  validatePropertyData(propertyData);

  const property = await propertyRepository.createProperty(propertyData);

  return property;
};

export const getPropertyById = async (id: string): Promise<Property> => {
  const property = await propertyRepository.findPropertyById(id);

  if (!property) {
    throw {
      status: 404,
      message: 'Property not found'
    } as ServiceError;
  }

  return property;
};

export const getAllProperties = async (filters?: PropertyFilters): Promise<Property[]> => {
  return await propertyRepository.findAllProperties(filters);
};

export const getUserProperties = async (userId: string): Promise<Property[]> => {
  return await propertyRepository.findPropertiesByUserId(userId);
};

export const updateProperty = async (
  propertyId: string,
  userId: string,
  updates: Partial<CreatePropertyData>
): Promise<Property> => {
  const property = await propertyRepository.findPropertyById(propertyId);

  if (!property) {
    throw {
      status: 404,
      message: 'Property not found'
    } as ServiceError;
  }

  if (property.user_id !== userId) {
    throw {
      status: 403,
      message: 'You are not authorized to update this property'
    } as ServiceError;
  }

  validatePropertyData(updates);

  const updatedProperty = await propertyRepository.updateProperty(propertyId, updates);

  if (!updatedProperty) {
    throw {
      status: 500,
      message: 'Failed to update property'
    } as ServiceError;
  }

  return updatedProperty;
};

export const deleteProperty = async (propertyId: string, userId: string): Promise<void> => {
  const property = await propertyRepository.findPropertyById(propertyId);

  if (!property) {
    throw {
      status: 404,
      message: 'Property not found'
    } as ServiceError;
  }

  if (property.user_id !== userId) {
    throw {
      status: 403,
      message: 'You are not authorized to delete this property'
    } as ServiceError;
  }

  await propertyRepository.deleteProperty(propertyId);
};

export const searchProperties = async (searchTerm: string): Promise<Property[]> => {
  if (!searchTerm || searchTerm.trim().length === 0) {
    throw {
      status: 400,
      message: 'Search term is required'
    } as ServiceError;
  }

  return await propertyRepository.searchProperties(searchTerm);
};
