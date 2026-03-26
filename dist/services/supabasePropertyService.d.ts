import { Property, PropertyFilters, CreatePropertyData } from '../repositories/supabasePropertyRepository.js';
export declare const createProperty: (propertyData: CreatePropertyData) => Promise<Property>;
export declare const getPropertyById: (id: string) => Promise<Property>;
export declare const getAllProperties: (filters?: PropertyFilters) => Promise<Property[]>;
export declare const getUserProperties: (userId: string) => Promise<Property[]>;
export declare const updateProperty: (propertyId: string, userId: string, updates: Partial<CreatePropertyData>) => Promise<Property>;
export declare const deleteProperty: (propertyId: string, userId: string) => Promise<void>;
export declare const searchProperties: (searchTerm: string) => Promise<Property[]>;
//# sourceMappingURL=supabasePropertyService.d.ts.map