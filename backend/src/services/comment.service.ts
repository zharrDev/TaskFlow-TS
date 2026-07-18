import prisma from '../config/database';
import { NotFoundError, ForbiddenError } from '../middlewares/error.middleware';
import { CreateCommentInput, UpdateCommentInput } from '../validators/comment.validator';

export class CommentService {
  async getByTask(taskId: number) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: { id: true, name: true, email: true, profile: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(taskId: number, userId: number, data: CreateCommentInput) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const comment = await prisma.comment.create({
      data: {
        taskId,
        userId,
        content: data.content,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, profile: true },
        },
      },
    });

    // Notify task assignee if someone else comments
    if (task.assigneeId && task.assigneeId !== userId) {
      const commenter = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });

      await prisma.notification.create({
        data: {
          userId: task.assigneeId,
          title: 'New Comment',
          message: `${commenter?.name} commented on task "${task.title}"`,
          type: 'INFO',
        },
      });
    }

    await prisma.activityLog.create({
      data: {
        userId,
        projectId: task.projectId,
        action: 'comment_added',
        description: `Commented on task "${task.title}"`,
      },
    });

    return comment;
  }

  async update(id: number, userId: number, data: UpdateCommentInput) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenError('You can only edit your own comments');
    }

    return prisma.comment.update({
      where: { id },
      data: { content: data.content },
      include: {
        user: {
          select: { id: true, name: true, email: true, profile: true },
        },
      },
    });
  }

  async delete(id: number, userId: number, roleName: string) {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    if (comment.userId !== userId && roleName !== 'Admin') {
      throw new ForbiddenError('You can only delete your own comments');
    }

    await prisma.comment.delete({ where: { id } });

    return { message: 'Comment deleted successfully' };
  }
}

export default new CommentService();
