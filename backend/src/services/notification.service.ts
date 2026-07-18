import prisma from '../config/database';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';

export class NotificationService {
  async getByUser(userId: number, query: { page?: string; limit?: string; unreadOnly?: string }) {
    const { page, limit, skip } = parsePagination(query);

    const where: any = { userId };
    if (query.unreadOnly === 'true') {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    const pagination = createPaginationMeta(page, limit, total);

    return { notifications, unreadCount, pagination };
  }

  async markAsRead(id: number, userId: number) {
    const notification = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!notification) {
      return null;
    }

    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: number) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { message: 'All notifications marked as read' };
  }

  async create(userId: number, title: string, message: string, type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO' = 'INFO') {
    return prisma.notification.create({
      data: { userId, title, message, type },
    });
  }
}

export default new NotificationService();
