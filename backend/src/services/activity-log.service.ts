import prisma from '../config/database';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';

export class ActivityLogService {
  async getAll(query: { page?: string; limit?: string }, userId?: number, roleName?: string) {
    const { page, limit, skip } = parsePagination(query);

    const where: any = {};

    if (roleName !== 'Admin' && userId) {
      where.OR = [
        { userId },
        {
          project: {
            OR: [
              { leaderId: userId },
              { members: { some: { userId } } },
            ],
          },
        },
      ];
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          project: {
            select: { id: true, name: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.activityLog.count({ where }),
    ]);

    const pagination = createPaginationMeta(page, limit, total);

    return { logs, pagination };
  }

  async getByProject(projectId: number, query: { page?: string; limit?: string }) {
    const { page, limit, skip } = parsePagination(query);

    const where = { projectId };

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.activityLog.count({ where }),
    ]);

    const pagination = createPaginationMeta(page, limit, total);

    return { logs, pagination };
  }

  async create(userId: number, action: string, description?: string, projectId?: number) {
    return prisma.activityLog.create({
      data: {
        userId,
        action,
        description: description || null,
        projectId: projectId || null,
      },
    });
  }
}

export default new ActivityLogService();
