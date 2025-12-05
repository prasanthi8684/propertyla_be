import { supabase } from '../config/supabase.js';

export interface Property {
  id: string;
  title: string;
  description: string;
  listing_type: 'rent' | 'sale';
  property_type: string;
  tenure: 'freehold' | 'leasehold';
  property_name?: string;
  street_name?: string;
  city_name?: string;
  state?: string;
  county?: string;
  pincode?: string;
  landmark?: string;
  price: number;
  buildup_area?: number;
  furnishing?: 'Fully' | 'Partially' | 'Unfurnished';
  bedrooms?: number;
  bathrooms?: number;
  availability?: 'Immediate' | 'Next month' | 'Under Construction';
  floor_level?: string;
  year_of_build?: number;
  negotiable?: boolean;
  swimming_pool?: boolean;
  gymnasium?: boolean;
  playground?: boolean;
  bbq_area?: boolean;
  function_room?: boolean;
  games_room?: boolean;
  sky_garden?: boolean;
  reading_room?: boolean;
  lounge?: boolean;
  covered_parking?: boolean;
  visitor_parking?: boolean;
  service_lift?: boolean;
  prayer_room?: boolean;
  parcel_locker?: boolean;
  laundry_room?: boolean;
  cafeteria?: boolean;
  security_24h?: boolean;
  cctv_surveillance?: boolean;
  access_card_system?: boolean;
  fire_alarm_system?: boolean;
  emergency_exit?: boolean;
  images?: string[];
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

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

export interface CreatePropertyData {
  title: string;
  description: string;
  listing_type: 'rent' | 'sale';
  property_type: string;
  tenure: 'freehold' | 'leasehold';
  property_name?: string;
  street_name?: string;
  city_name?: string;
  state?: string;
  county?: string;
  pincode?: string;
  landmark?: string;
  price: number;
  buildup_area?: number;
  furnishing?: 'Fully' | 'Partially' | 'Unfurnished';
  bedrooms?: number;
  bathrooms?: number;
  availability?: 'Immediate' | 'Next month' | 'Under Construction';
  floor_level?: string;
  year_of_build?: number;
  negotiable?: boolean;
  swimming_pool?: boolean;
  gymnasium?: boolean;
  playground?: boolean;
  bbq_area?: boolean;
  function_room?: boolean;
  games_room?: boolean;
  sky_garden?: boolean;
  reading_room?: boolean;
  lounge?: boolean;
  covered_parking?: boolean;
  visitor_parking?: boolean;
  service_lift?: boolean;
  prayer_room?: boolean;
  parcel_locker?: boolean;
  laundry_room?: boolean;
  cafeteria?: boolean;
  security_24h?: boolean;
  cctv_surveillance?: boolean;
  access_card_system?: boolean;
  fire_alarm_system?: boolean;
  emergency_exit?: boolean;
  images?: string[];
  user_id: string;
}

export const createProperty = async (propertyData: CreatePropertyData): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .insert([propertyData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Property;
};

export const findPropertyById = async (id: string): Promise<Property | null> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Property | null;
};

export const findAllProperties = async (filters?: PropertyFilters): Promise<Property[]> => {
  let query = supabase.from('properties').select('*');

  if (filters) {
    if (filters.listingType) {
      query = query.eq('listing_type', filters.listingType);
    }

    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }

    if (filters.tenure) {
      query = query.eq('tenure', filters.tenure);
    }

    if (filters.furnishing) {
      query = query.eq('furnishing', filters.furnishing);
    }

    if (filters.availability) {
      query = query.eq('availability', filters.availability);
    }

    if (filters.cityName) {
      query = query.ilike('city_name', `%${filters.cityName}%`);
    }

    if (filters.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.minBedrooms !== undefined) {
      query = query.gte('bedrooms', filters.minBedrooms);
    }

    if (filters.maxBedrooms !== undefined) {
      query = query.lte('bedrooms', filters.maxBedrooms);
    }

    if (filters.minBathrooms !== undefined) {
      query = query.gte('bathrooms', filters.minBathrooms);
    }

    if (filters.minArea !== undefined) {
      query = query.gte('buildup_area', filters.minArea);
    }

    if (filters.negotiable !== undefined) {
      query = query.eq('negotiable', filters.negotiable);
    }

    if (filters.swimmingPool !== undefined) {
      query = query.eq('swimming_pool', filters.swimmingPool);
    }

    if (filters.gymnasium !== undefined) {
      query = query.eq('gymnasium', filters.gymnasium);
    }

    if (filters.coveredParking !== undefined) {
      query = query.eq('covered_parking', filters.coveredParking);
    }

    if (filters.security24h !== undefined) {
      query = query.eq('security_24h', filters.security24h);
    }
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as Property[];
};

export const findPropertiesByUserId = async (userId: string): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Property[];
};

export const updateProperty = async (id: string, updates: Partial<CreatePropertyData>): Promise<Property | null> => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Property;
};

export const deleteProperty = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

export const searchProperties = async (searchTerm: string): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,city_name.ilike.%${searchTerm}%,street_name.ilike.%${searchTerm}%,landmark.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Property[];
};

export const countPropertiesByUser = async (userId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return count || 0;
};
