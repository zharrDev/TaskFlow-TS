import bcrypt from 'bcrypt';
import prisma from '../config/database';
import { BadRequestError, NotFoundError } from '../middlewares/error.middleware';
import { CreateUserInput, UpdateUserInput } from '../validators/user.validator';
import { parsePagination, createPaginationMeta } from '../utils/pagination.util';
import { Prisma } from '@prisma/client';

export class UserService {
  async getAll(query: {
    page?: string;
    limit?: string;
    search?: string;
    role?: string;
    isActive?: string;
    sort?: string;
    order?: string;
  }) {
    const { page, limit, skip } = parsePagination(query);

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    // Search by name or email
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { email: { contains: query.search } },
      ];
    }

    // Filter by role
    if (query.role) {
      where.role = { name: query.role };
    }

    // Filter by active status
    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    // Sorting
    const sortField = query.sort || 'createdAt';
    const sortOrder = (query.order || 'desc') as Prisma.SortOrder;
    const orderBy: Prisma.UserOrderByWithRelationInput = {};

    if (sortField === 'name' || sortField === 'email' || sortField === 'createdAt') {
      (orderBy as Record<string, Prisma.SortOrder>)[sortField] = sortOrder;
    } else {
      orderBy.createdAt = 'desc';
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          role: true,
          profile: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      prisma.user.count({ where }),
    ]);

    const pagination = createPaginationMeta(page, limit, total);

    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role.name,
        roleId: u.roleId,
        isActive: u.isActive,
        profile: u.profile,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      pagination,
    };
  }

  async getById(id: number) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        role: true,
        profile: true,
        projectMembers: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      roleId: user.roleId,
      isActive: user.isActive,
      profile: user.profile,
      projects: user.projectMembers.map((pm) => pm.project),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(data: CreateUserInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestError('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roleId: data.roleId,
        profile: {
          create: {
            phoneNumber: data.phoneNumber || null,
            bio: data.bio || null,
          },
        },
      },
      include: {
        role: true,
        profile: true,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name,
      roleId: user.roleId,
      isActive: user.isActive,
      profile: user.profile,
    };
  }

  async update(id: number, data: UpdateUserInput) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existing = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existing) {
        throw new BadRequestError('Email is already taken');
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.roleId && { roleId: data.roleId }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        profile: {
          update: {
            ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber }),
            ...(data.bio !== undefined && { bio: data.bio }),
          },
        },
      },
      include: {
        role: true,
        profile: true,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role.name,
      roleId: updated.roleId,
      isActive: updated.isActive,
      profile: updated.profile,
    };
  }

  async delete(id: number) {
    const user = await prisma.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Soft delete
    await prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    return { message: 'User deleted successfully' };
  }

  async getRoles() {
    return prisma.role.findMany({
      orderBy: { id: 'asc' },
    });
  }
}

export default new UserService();
