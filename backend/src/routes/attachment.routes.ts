import { Router } from 'express';
import attachmentController from '../controllers/attachment.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

router.use(authenticate);

router.get('/task/:taskId', attachmentController.getByTask);
router.post('/task/:taskId', upload.single('file'), attachmentController.upload);
router.delete('/:id', attachmentController.delete);

export default router;
