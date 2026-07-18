import { Request, Response, NextFunction } from 'express';
import taskService from '../services/task.service';
import { sendSuccess, sendCreated } from '../utils/response.util';

export class TaskController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskService.getAll(
        req.query as any,
        req.user!.id,
        req.user!.roleName
      );
      sendSuccess(res, result.tasks, 'Tasks retrieved successfully', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await taskService.getById(id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getByProject(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const result = await taskService.getByProject(projectId);
      sendSuccess(res, result, 'Tasks retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await taskService.create(req.body, req.user!.id);
      sendCreated(res, result, 'Task created successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await taskService.update(id, req.body, req.user!.id);
      sendSuccess(res, result, 'Task updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      const result = await taskService.updateStatus(id, status, req.user!.id);
      sendSuccess(res, result, 'Task status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await taskService.delete(id, req.user!.id);
      sendSuccess(res, result, 'Task deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new TaskController();
