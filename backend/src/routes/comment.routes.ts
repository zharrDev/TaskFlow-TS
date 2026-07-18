import { Router } from 'express';
import commentController from '../controllers/comment.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { createCommentSchema, updateCommentSchema } from '../validators/comment.validator';

const router = Router();

router.use(authenticate);

router.get('/task/:taskId', commentController.getByTask);
router.post('/task/:taskId', validate(createCommentSchema), commentController.create);
router.put('/:id', validate(updateCommentSchema), commentController.update);
router.delete('/:id', commentController.delete);

export default router;
