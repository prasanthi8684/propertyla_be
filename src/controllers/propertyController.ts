import { Request, Response } from 'express';
import * as propertyService from '../services/propertyService.js';
import { Property } from '../entities/Property.js';
import { AppError } from '../utils/errors.js';

export const createProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const propertyData: Partial<Property> = {
      ...req.body,
      userId
    };

    const property = await propertyService.createProperty(propertyData);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create property'
      });
    }
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch property'
      });
    }
  }
};

export const getAllProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters = {
      listingType: req.query.listingType as 'rent' | 'sale' | undefined,
      propertyType: req.query.propertyType as string | undefined,
      tenure: req.query.tenure as 'freehold' | 'leasehold' | undefined,
      furnishing: req.query.furnishing as 'Fully' | 'Partially' | 'Unfurnished' | undefined,
      availability: req.query.availability as
        | 'Immediate'
        | 'Next month'
        | 'Under Construction'
        | undefined,
      cityName: req.query.cityName as string | undefined,
      state: req.query.state as string | undefined,
      status: req.query.status as string | undefined,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      minBedrooms: req.query.minBedrooms ? parseInt(req.query.minBedrooms as string) : undefined,
      maxBedrooms: req.query.maxBedrooms ? parseInt(req.query.maxBedrooms as string) : undefined,
      minBathrooms: req.query.minBathrooms
        ? parseInt(req.query.minBathrooms as string)
        : undefined,
      minArea: req.query.minArea ? parseFloat(req.query.minArea as string) : undefined,
      negotiable:
        req.query.negotiable === 'true' ? true : req.query.negotiable === 'false' ? false : undefined,
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties'
    });
  }
};

export const getUserProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user properties'
    });
  }
};

export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
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
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to update property'
      });
    }
  }
};

export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
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
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete property'
      });
    }
  }
};

export const searchProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchTerm = req.query.q as string;

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
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to search properties'
      });
    }
  }
};
