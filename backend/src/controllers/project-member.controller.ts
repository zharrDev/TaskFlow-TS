import { Request, Response, NextFunction } from 'express';
import projectMemberService from '../services/project-member.service';
import { sendSuccess, sendCreated } from '../utils/response.util';

export class ProjectMemberController {
  async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const result = await projectMemberService.getMembers(projectId);
      sendSuccess(res, result, 'Members retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const { userId } = req.body;
      const result = await projectMemberService.addMember(
        projectId, userId, req.user!.id, req.user!.roleName
      );
      sendCreated(res, result, 'Member added successfully');
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const userId = parseInt(req.params.userId, 10);
      const result = await projectMemberService.removeMember(
        projectId, userId, req.user!.id, req.user!.roleName
      );
      sendSuccess(res, result, 'Member removed successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new ProjectMemberController();
