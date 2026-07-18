import prisma from '../config/database';
import { NotFoundError, ForbiddenError } from '../middlewares/error.middleware';
import { CreateProjectInput, UpdateProjectInput } from '../validators/project.validator';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';
import { Prisma } from '@prisma/client';

export class ProjectService {
  async getAll(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    sort?: string;
    order?: string;
  }, userId?: number, roleName?: string) {
    const { page, limit, skip } = parsePagination(query);

    const where: Prisma.ProjectWhereInput = {
      deletedAt: null,
    };

    // Non-admin can only see their projects
    if (roleName !== 'Admin' && userId) {
      where.OR = [
        { leaderId: userId },
        { members: { some: { userId } } },
      ];
    }

    if (query.search) {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        {
          OR: [
            { name: { contains: query.search } },
            { description: { contains: query.search } },
          ],
        },
      ];
    }

    if (query.status) {
      where.status = query.status as Prisma.EnumProjectStatusFilter;
    }

    const sortField = query.sort || 'createdAt';
    const sortOrder = (query.order || 'desc') as Prisma.SortOrder;
    const orderBy: Prisma.ProjectOrderByWithRelationInput = {};

    if (sortField === 'name' || sortField === 'createdAt' || sortField === 'startDate' || sortField === 'endDate') {
      (orderBy as Record<string, Prisma.SortOrder>)[sortField] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          leader: {
            select: { id: true, name: true, email: true },
          },
          members: {
            include: {
              user: {
                select: { id: true, name: true, email: true },
              },
            },
          },
          _count: {
            select: { tasks: true },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.project.count({ where }),
    ]);

    const pagination = createPaginationMeta(page, limit, total);

    return { projects, pagination };
  }

  async getById(id: number) {
    const project = await prisma.project.findFirst({
      where: { id, deletedAt: null },
      include: {
        leader: {
          select: { id: true, name: true, email: true, profile: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, profile: true },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { tasks: true, members: true },
        },
      },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return project;
  }

  async create(data: CreateProjectInput, leaderId: number) {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description || null,
        status: (data.status as any) || 'PLANNING',
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        leaderId,
        members: {
          create: {
            userId: leaderId,
          },
        },
      },
      include: {
        leader: {
          select: { id: true, name: true, email: true },
        },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: leaderId,
        projectId: project.id,
        action: 'project_created',
        description: `Created project "${project.name}"`,
      },
    });

    return project;
  }

  async update(id: number, data: UpdateProjectInput, userId: number, roleName: string) {
    const project = await prisma.project.findFirst({
      where: { id, deletedAt: null },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (roleName !== 'Admin' && project.leaderId !== userId) {
      throw new ForbiddenError('Only the project leader or admin can update this project');
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status && { status: data.status as any }),
        ...(data.startDate !== undefined && { startDate: data.startDate ? new Date(data.startDate) : null }),
        ...(data.endDate !== undefined && { endDate: data.endDate ? new Date(data.endDate) : null }),
      },
      include: {
        leader: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        projectId: id,
        action: 'project_updated',
        description: `Updated project "${updated.name}"`,
      },
    });

    return updated;
  }

  async delete(id: number, userId: number, roleName: string) {
    const project = await prisma.project.findFirst({
      where: { id, deletedAt: null },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (roleName !== 'Admin' && project.leaderId !== userId) {
      throw new ForbiddenError('Only the project leader or admin can delete this project');
    }

    await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        projectId: id,
        action: 'project_deleted',
        description: `Deleted project "${project.name}"`,
      },
    });

    return { message: 'Project deleted successfully' };
  }
}

export default new ProjectService();
