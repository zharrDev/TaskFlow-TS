import { Request, Response, NextFunction } from 'express';
import attachmentService from '../services/attachment.service';
import { sendSuccess, sendCreated } from '../utils/response.util';
import { BadRequestError } from '../middlewares/error.middleware';

export class AttachmentController {
  async getByTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = parseInt(req.params.taskId, 10);
      const result = await attachmentService.getByTask(taskId);
      sendSuccess(res, result, 'Attachments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = parseInt(req.params.taskId, 10);
      if (!req.file) {
        throw new BadRequestError('File is required');
      }
      const result = await attachmentService.upload(taskId, req.user!.id, req.file);
      sendCreated(res, result, 'File uploaded successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await attachmentService.delete(id, req.user!.id);
      sendSuccess(res, result, 'Attachment deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new AttachmentController();
