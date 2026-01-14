import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request & { requestId?: string }>();
    const res = ctx.getResponse<Response>();

    const requestId = req.requestId;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Something went wrong';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;

      // If you throw new HttpException({code,message}, status)
      if (typeof response === 'object' && response) {
        code = response.code ?? `HTTP_${status}`;
        message = response.message ?? exception.message ?? message;
      } else {
        code = `HTTP_${status}`;
        message = exception.message ?? message;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    res.status(status).json({
      code,
      message,
      requestId,
    });
  }
}
