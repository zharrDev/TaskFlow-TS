import { Router } from 'express';
import taskController from '../controllers/task.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from '../validators/task.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all tasks
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string, enum: [TODO, IN_PROGRESS, REVIEW, DONE] } }
 *       - { in: query, name: priority, schema: { type: string, enum: [LOW, MEDIUM, HIGH, URGENT] } }
 *       - { in: query, name: projectId, schema: { type: integer } }
 *       - { in: query, name: assigneeId, schema: { type: integer } }
 *       - { in: query, name: sort, schema: { type: string } }
 *       - { in: query, name: order, schema: { type: string, enum: [asc, desc] } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 */
router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.get('/project/:projectId', taskController.getByProject);
router.post('/', validate(createTaskSchema), taskController.create);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.patch('/:id/status', validate(updateTaskStatusSchema), taskController.updateStatus);
router.delete('/:id', taskController.delete);

export default router;
