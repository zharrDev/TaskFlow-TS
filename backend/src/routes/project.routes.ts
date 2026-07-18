import { Router } from 'express';
import projectController from '../controllers/project.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /projects:
 *   get:
 *     tags: [Projects]
 *     summary: Get all projects
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string, enum: [PLANNING, ONGOING, COMPLETED, CANCELLED] } }
 *       - { in: query, name: sort, schema: { type: string } }
 *       - { in: query, name: order, schema: { type: string, enum: [asc, desc] } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 */
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.post('/', authorize('Admin', 'Project Leader'), validate(createProjectSchema), projectController.create);
router.put('/:id', authorize('Admin', 'Project Leader'), validate(updateProjectSchema), projectController.update);
router.delete('/:id', authorize('Admin', 'Project Leader'), projectController.delete);

export default router;
