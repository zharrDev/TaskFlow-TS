import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import projectRoutes from './project.routes';
import projectMemberRoutes from './project-member.routes';
import taskRoutes from './task.routes';
import commentRoutes from './comment.routes';
import attachmentRoutes from './attachment.routes';
import notificationRoutes from './notification.routes';
import activityLogRoutes from './activity-log.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/members', projectMemberRoutes);
router.use('/tasks', taskRoutes);
router.use('/comments', commentRoutes);
router.use('/attachments', attachmentRoutes);
router.use('/notifications', notificationRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
