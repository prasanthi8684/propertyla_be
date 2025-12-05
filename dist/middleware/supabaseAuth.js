import { supabase } from '../config/supabase.js';
export const authenticateSupabaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Authorization token is required'
            });
            return;
        }
        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
            return;
        }
        req.user = {
            userId: user.id,
            email: user.email || ''
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};
//# sourceMappingURL=supabaseAuth.js.map