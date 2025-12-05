import * as propertyService from '../services/supabasePropertyService.js';
export const createProperty = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        const propertyData = {
            ...req.body,
            user_id: userId
        };
        const property = await propertyService.createProperty(propertyData);
        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            data: property
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to create property'
        });
    }
};
export const getPropertyById = async (req, res) => {
    try {
        const propertyId = req.params.id;
        if (!propertyId) {
            res.status(400).json({
                success: false,
                message: 'Property ID is required'
            });
            return;
        }
        const property = await propertyService.getPropertyById(propertyId);
        res.status(200).json({
            success: true,
            data: property
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to fetch property'
        });
    }
};
export const getAllProperties = async (req, res) => {
    try {
        const filters = {
            listingType: req.query.listingType,
            propertyType: req.query.propertyType,
            tenure: req.query.tenure,
            furnishing: req.query.furnishing,
            availability: req.query.availability,
            cityName: req.query.cityName,
            state: req.query.state,
            status: req.query.status,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
            minBedrooms: req.query.minBedrooms ? parseInt(req.query.minBedrooms) : undefined,
            maxBedrooms: req.query.maxBedrooms ? parseInt(req.query.maxBedrooms) : undefined,
            minBathrooms: req.query.minBathrooms ? parseInt(req.query.minBathrooms) : undefined,
            minArea: req.query.minArea ? parseFloat(req.query.minArea) : undefined,
            negotiable: req.query.negotiable === 'true' ? true : req.query.negotiable === 'false' ? false : undefined,
            swimmingPool: req.query.swimmingPool === 'true' ? true : undefined,
            gymnasium: req.query.gymnasium === 'true' ? true : undefined,
            coveredParking: req.query.coveredParking === 'true' ? true : undefined,
            security24h: req.query.security24h === 'true' ? true : undefined
        };
        const properties = await propertyService.getAllProperties(filters);
        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to fetch properties'
        });
    }
};
export const getUserProperties = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        const properties = await propertyService.getUserProperties(userId);
        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to fetch user properties'
        });
    }
};
export const updateProperty = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const propertyId = req.params.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        if (!propertyId) {
            res.status(400).json({
                success: false,
                message: 'Property ID is required'
            });
            return;
        }
        const updatedProperty = await propertyService.updateProperty(propertyId, userId, req.body);
        res.status(200).json({
            success: true,
            message: 'Property updated successfully',
            data: updatedProperty
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to update property'
        });
    }
};
export const deleteProperty = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const propertyId = req.params.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        if (!propertyId) {
            res.status(400).json({
                success: false,
                message: 'Property ID is required'
            });
            return;
        }
        await propertyService.deleteProperty(propertyId, userId);
        res.status(200).json({
            success: true,
            message: 'Property deleted successfully'
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to delete property'
        });
    }
};
export const searchProperties = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            res.status(400).json({
                success: false,
                message: 'Search term is required'
            });
            return;
        }
        const properties = await propertyService.searchProperties(searchTerm);
        res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });
    }
    catch (error) {
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Failed to search properties'
        });
    }
};
//# sourceMappingURL=supabasePropertyController.js.map