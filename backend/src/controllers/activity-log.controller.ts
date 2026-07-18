import { Request, Response, NextFunction } from 'express';
import activityLogService from '../services/activity-log.service';
import { sendSuccess } from '../utils/response.util';

export class ActivityLogController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await activityLogService.getAll(
        req.query as any,
        req.user!.id,
        req.user!.roleName
      );
      sendSuccess(res, result.logs, 'Activity logs retrieved successfully', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getByProject(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const result = await activityLogService.getByProject(projectId, req.query as any);
      sendSuccess(res, result.logs, 'Activity logs retrieved successfully', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }
}

export default new ActivityLogController();
