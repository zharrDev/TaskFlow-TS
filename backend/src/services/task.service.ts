import prisma from '../config/database';
import { NotFoundError } from '../middlewares/error.middleware';
import { CreateTaskInput, UpdateTaskInput } from '../validators/task.validator';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';
import { Prisma } from '@prisma/client';

export class TaskService {
  async getAll(query: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    priority?: string;
    projectId?: string;
    assigneeId?: string;
    sort?: string;
    order?: string;
  }, userId?: number, roleName?: string) {
    const { page, limit, skip } = parsePagination(query);

    const where: Prisma.TaskWhereInput = {};

    // Non-admin can only see tasks in their projects
    if (roleName !== 'Admin' && userId) {
      where.project = {
        deletedAt: null,
        OR: [
          { leaderId: userId },
          { members: { some: { userId } } },
        ],
      };
    } else {
      where.project = { deletedAt: null };
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    if (query.status) {
      where.status = query.status as any;
    }

    if (query.priority) {
      where.priority = query.priority as any;
    }

    if (query.projectId) {
      where.projectId = parseInt(query.projectId, 10);
    }

    if (query.assigneeId) {
      where.assigneeId = parseInt(query.assigneeId, 10);
    }

    const sortField = query.sort || 'createdAt';
    const sortOrder = (query.order || 'desc') as Prisma.SortOrder;
    const orderBy: Prisma.TaskOrderByWithRelationInput = {};

    if (['title', 'createdAt', 'dueDate', 'priority', 'status'].includes(sortField)) {
      (orderBy as Record<string, Prisma.SortOrder>)[sortField] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          project: {
            select: { id: true, name: true },
          },
          assignee: {
            select: { id: true, name: true, email: true },
          },
          _count: {
            select: { comments: true, attachments: true },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.task.count({ where }),
    ]);

    const pagination = createPaginationMeta(page, limit, total);
    return { tasks, pagination };
  }

  async getById(id: number) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { id: true, name: true, leaderId: true },
        },
        assignee: {
          select: { id: true, name: true, email: true, profile: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, profile: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          include: {
            uploader: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return task;
  }

  async getByProject(projectId: number) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, deletedAt: null },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    return prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { comments: true, attachments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateTaskInput, userId: number) {
    const project = await prisma.project.findFirst({
      where: { id: data.projectId, deletedAt: null },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    const task = await prisma.task.create({
      data: {
        projectId: data.projectId,
        assigneeId: data.assigneeId || null,
        title: data.title,
        description: data.description || null,
        priority: (data.priority as any) || 'MEDIUM',
        status: (data.status as any) || 'TODO',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    // Notify assignee
    if (task.assigneeId) {
      await prisma.notification.create({
        data: {
          userId: task.assigneeId,
          title: 'New Task Assigned',
          message: `You have been assigned to task "${task.title}" in project "${task.project.name}"`,
          type: 'INFO',
        },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId,
        projectId: data.projectId,
        action: 'task_created',
        description: `Created task "${task.title}"`,
      },
    });

    return task;
  }

  async update(id: number, data: UpdateTaskInput, userId: number) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.priority && { priority: data.priority as any }),
        ...(data.status && { status: data.status as any }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
      },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        projectId: task.projectId,
        action: 'task_updated',
        description: `Updated task "${updated.title}"`,
      },
    });

    return updated;
  }

  async updateStatus(id: number, status: string, userId: number) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const updated = await prisma.task.update({
      where: { id },
      data: { status: status as any },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        projectId: task.projectId,
        action: 'task_status_changed',
        description: `Changed task "${task.title}" status from ${task.status} to ${status}`,
      },
    });

    return updated;
  }

  async delete(id: number, userId: number) {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    await prisma.task.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId,
        projectId: task.projectId,
        action: 'task_deleted',
        description: `Deleted task "${task.title}"`,
      },
    });

    return { message: 'Task deleted successfully' };
  }
}

export default new TaskService();
