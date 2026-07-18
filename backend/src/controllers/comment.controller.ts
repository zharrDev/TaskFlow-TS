import { Request, Response, NextFunction } from 'express';
import commentService from '../services/comment.service';
import { sendSuccess, sendCreated } from '../utils/response.util';

export class CommentController {
  async getByTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = parseInt(req.params.taskId, 10);
      const result = await commentService.getByTask(taskId);
      sendSuccess(res, result, 'Comments retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const taskId = parseInt(req.params.taskId, 10);
      const result = await commentService.create(taskId, req.user!.id, req.body);
      sendCreated(res, result, 'Comment added successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await commentService.update(id, req.user!.id, req.body);
      sendSuccess(res, result, 'Comment updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await commentService.delete(id, req.user!.id, req.user!.roleName);
      sendSuccess(res, result, 'Comment deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new CommentController();
