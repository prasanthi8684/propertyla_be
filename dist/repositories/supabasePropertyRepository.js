import { supabase } from '../config/supabase.js';
export const createProperty = async (propertyData) => {
    const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
};
export const findPropertyById = async (id) => {
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();
    if (error) {
        throw new Error(error.message);
    }
    return data;
};
export const findAllProperties = async (filters) => {
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
    return data;
};
export const findPropertiesByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) {
        throw new Error(error.message);
    }
    return data;
};
export const updateProperty = async (id, updates) => {
    const { data, error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
};
export const deleteProperty = async (id) => {
    const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
    if (error) {
        throw new Error(error.message);
    }
};
export const searchProperties = async (searchTerm) => {
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,city_name.ilike.%${searchTerm}%,street_name.ilike.%${searchTerm}%,landmark.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });
    if (error) {
        throw new Error(error.message);
    }
    return data;
};
export const countPropertiesByUser = async (userId) => {
    const { count, error } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
    if (error) {
        throw new Error(error.message);
    }
    return count || 0;
};
//# sourceMappingURL=supabasePropertyRepository.js.map