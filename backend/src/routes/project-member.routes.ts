import { Router } from 'express';
import projectMemberController from '../controllers/project-member.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/project/:projectId', projectMemberController.getMembers);
router.post('/project/:projectId', projectMemberController.addMember);
router.delete('/project/:projectId/user/:userId', projectMemberController.removeMember);

export default router;
