import prisma from '../config/database';
import { NotFoundError } from '../middlewares/error.middleware';
import fs from 'fs';
import path from 'path';

export class AttachmentService {
  async getByTask(taskId: number) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return prisma.attachment.findMany({
      where: { taskId },
      include: {
        uploader: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upload(taskId: number, userId: number, file: Express.Multer.File) {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const fileType = file.mimetype.startsWith('image/') ? 'image' : 'pdf';

    const attachment = await prisma.attachment.create({
      data: {
        taskId,
        uploadedBy: userId,
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
        fileType,
      },
      include: {
        uploader: {
          select: { id: true, name: true },
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        userId,
        projectId: task.projectId,
        action: 'attachment_uploaded',
        description: `Uploaded file "${file.originalname}" to task "${task.title}"`,
      },
    });

    return attachment;
  }

  async delete(id: number, userId: number) {
    const attachment = await prisma.attachment.findUnique({ where: { id } });

    if (!attachment) {
      throw new NotFoundError('Attachment not found');
    }

    // Delete physical file
    const filePath = path.join(process.cwd(), attachment.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.attachment.delete({ where: { id } });

    return { message: 'Attachment deleted successfully' };
  }
}

export default new AttachmentService();
