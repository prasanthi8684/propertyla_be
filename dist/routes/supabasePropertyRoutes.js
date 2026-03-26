import { Router } from 'express';
import * as propertyController from '../controllers/supabasePropertyController.js';
import { authenticateSupabaseToken } from '../middleware/supabaseAuth.js';
const router = Router();
router.get('/search', propertyController.searchProperties);
router.get('/', propertyController.getAllProperties);
router.get('/my-properties', authenticateSupabaseToken, propertyController.getUserProperties);
router.get('/:id', propertyController.getPropertyById);
router.post('/', authenticateSupabaseToken, propertyController.createProperty);
router.put('/:id', authenticateSupabaseToken, propertyController.updateProperty);
router.delete('/:id', authenticateSupabaseToken, propertyController.deleteProperty);
export default router;
//# sourceMappingURL=supabasePropertyRoutes.js.map