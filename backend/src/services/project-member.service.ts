import prisma from '../config/database';
import { BadRequestError, NotFoundError, ForbiddenError } from '../middlewares/error.middleware';

export class ProjectMemberService {
  async getMembers(projectId: number) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: true,
            role: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return members.map((m) => ({
      id: m.id,
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
      role: m.user.role.name,
      profile: m.user.profile,
      joinedAt: m.joinedAt,
    }));
  }

  async addMember(projectId: number, userId: number, requestUserId: number, roleName: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (roleName !== 'Admin' && project.leaderId !== requestUserId) {
      throw new ForbiddenError('Only the project leader or admin can add members');
    }

    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null, isActive: true },
    });

    if (!user) {
      throw new NotFoundError('User not found or inactive');
    }

    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    if (existingMember) {
      throw new BadRequestError('User is already a member of this project');
    }

    const member = await prisma.projectMember.create({
      data: { projectId, userId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Create notification for added user
    await prisma.notification.create({
      data: {
        userId,
        title: 'Added to Project',
        message: `You have been added to project "${project.name}"`,
        type: 'INFO',
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: requestUserId,
        projectId,
        action: 'member_added',
        description: `Added ${user.name} to project "${project.name}"`,
      },
    });

    return member;
  }

  async removeMember(projectId: number, userId: number, requestUserId: number, roleName: string) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (roleName !== 'Admin' && project.leaderId !== requestUserId) {
      throw new ForbiddenError('Only the project leader or admin can remove members');
    }

    if (project.leaderId === userId) {
      throw new BadRequestError('Cannot remove the project leader');
    }

    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId },
      },
    });

    if (!member) {
      throw new NotFoundError('User is not a member of this project');
    }

    await prisma.projectMember.delete({
      where: { id: member.id },
    });

    // Unassign tasks
    await prisma.task.updateMany({
      where: { projectId, assigneeId: userId },
      data: { assigneeId: null },
    });

    return { message: 'Member removed successfully' };
  }
}

export default new ProjectMemberService();
