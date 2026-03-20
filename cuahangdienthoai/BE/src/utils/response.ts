import { Response } from 'express';

export const success = (res: Response, data: any, message = 'Success') => {
  return res.status(200).json({
    status: 'success',
    message,
    ...data
  });
};

export const error = (res: Response, message: string, statusCode = 500) => {
  return res.status(statusCode).json({
    status: 'error',
    message
  });
};
