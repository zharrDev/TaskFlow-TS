import { Request, Response, NextFunction } from 'express';
import projectService from '../services/project.service';
import { sendSuccess, sendCreated } from '../utils/response.util';

export class ProjectController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await projectService.getAll(
        req.query as any,
        req.user!.id,
        req.user!.roleName
      );
      sendSuccess(res, result.projects, 'Projects retrieved successfully', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await projectService.getById(id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await projectService.create(req.body, req.user!.id);
      sendCreated(res, result, 'Project created successfully');
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await projectService.update(id, req.body, req.user!.id, req.user!.roleName);
      sendSuccess(res, result, 'Project updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await projectService.delete(id, req.user!.id, req.user!.roleName);
      sendSuccess(res, result, 'Project deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectController();
