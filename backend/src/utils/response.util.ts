import { Response } from 'express';
import { PaginationMeta } from './pagination.util';

interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  pagination?: PaginationMeta;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]> | string[];
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  pagination?: PaginationMeta
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
    ...(pagination && { pagination }),
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string = 'Internal Server Error',
  statusCode: number = 500,
  errors?: Record<string, string[]> | string[]
): void => {
  const response: ErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, data: T, message: string = 'Created successfully'): void => {
  sendSuccess(res, data, message, 201);
};

export const sendNoContent = (res: Response): void => {
  res.status(204).send();
};
