import prisma from '../config/database';

export class DashboardService {
  async getStats(userId: number, roleName: string) {
    const isAdmin = roleName === 'Admin';

    // Base project filter
    const projectWhere: any = { deletedAt: null };
    if (!isAdmin) {
      projectWhere.OR = [
        { leaderId: userId },
        { members: { some: { userId } } },
      ];
    }

    // Get project IDs for the user
    const userProjects = await prisma.project.findMany({
      where: projectWhere,
      select: { id: true },
    });
    const projectIds = userProjects.map((p) => p.id);

    const taskWhere: any = isAdmin ? {} : { projectId: { in: projectIds } };

    const [
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      todoTasks,
      inProgressTasks,
      reviewTasks,
      doneTasks,
      overdueTasks,
      totalMembers,
      recentActivities,
    ] = await Promise.all([
      prisma.project.count({ where: projectWhere }),
      prisma.project.count({ where: { ...projectWhere, status: 'ONGOING' } }),
      prisma.project.count({ where: { ...projectWhere, status: 'COMPLETED' } }),
      prisma.task.count({ where: taskWhere }),
      prisma.task.count({ where: { ...taskWhere, status: 'TODO' } }),
      prisma.task.count({ where: { ...taskWhere, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { ...taskWhere, status: 'REVIEW' } }),
      prisma.task.count({ where: { ...taskWhere, status: 'DONE' } }),
      prisma.task.count({
        where: {
          ...taskWhere,
          status: { not: 'DONE' },
          dueDate: { lt: new Date() },
        },
      }),
      isAdmin
        ? prisma.user.count({ where: { deletedAt: null } })
        : prisma.projectMember.count({ where: { projectId: { in: projectIds } } }),
      prisma.activityLog.findMany({
        where: isAdmin ? {} : { OR: [{ userId }, { projectId: { in: projectIds } }] },
        include: {
          user: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
      },
      tasks: {
        total: totalTasks,
        todo: todoTasks,
        inProgress: inProgressTasks,
        review: reviewTasks,
        done: doneTasks,
        overdue: overdueTasks,
      },
      totalMembers,
      recentActivities,
    };
  }
}

export default new DashboardService();
