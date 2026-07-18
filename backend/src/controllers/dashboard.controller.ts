import { Request, Response, NextFunction } from 'express';
import dashboardService from '../services/dashboard.service';
import { sendSuccess } from '../utils/response.util';

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dashboardService.getStats(req.user!.id, req.user!.roleName);
      sendSuccess(res, result, 'Dashboard stats retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
