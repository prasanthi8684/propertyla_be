import { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0]
        }
      }
    });

    if (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: data.user?.id,
          email: data.user?.email,
          username: data.user?.user_metadata?.username
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: data.session?.access_token,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          username: data.user?.user_metadata?.username
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser(
      req.headers.authorization?.substring(7) || ''
    );

    if (error || !user) {
      res.status(401).json({
        success: false,
        message: 'Failed to fetch user profile'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username,
        created_at: user.created_at
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch profile'
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    await supabase.auth.signOut();

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Logout failed'
    });
  }
};
