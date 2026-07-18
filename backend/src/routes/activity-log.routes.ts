import { Router } from 'express';
import activityLogController from '../controllers/activity-log.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', activityLogController.getAll);
router.get('/project/:projectId', activityLogController.getByProject);

export default router;
