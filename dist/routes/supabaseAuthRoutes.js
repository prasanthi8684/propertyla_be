import { Router } from 'express';
import * as authController from '../controllers/supabaseAuthController.js';
import { authenticateSupabaseToken } from '../middleware/supabaseAuth.js';
const router = Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticateSupabaseToken, authController.getProfile);
router.post('/logout', authenticateSupabaseToken, authController.logout);
export default router;
//# sourceMappingURL=supabaseAuthRoutes.js.map