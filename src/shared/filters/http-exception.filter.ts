import { FileHandlerService } from './../services/file-handler.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    console.log("error",error);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // console.log("request",request)
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof HttpException
        ? error.message
        : {
          error: typeof(error)=="string" ? error : error.name, 
          message: typeof(error)=="string" ? error : error.message 
        };

    //Delete Already Uploaded File If Validation Failed
    // const fileHandler = new FileHandlerService();
    // if (request.file) {
    //   fileHandler.deleteFileAtPath(request.file.path);
    // }
    // if (request.files) {
    //   for (let index = 0; index < request.files.length; index++) {
    //     const file = request.files[index];
    //     fileHandler.deleteFileAtPath(file);
    //   }
    // }
    //Delete Already Uploaded File If Validation Failed

    const errorObj =
      error instanceof HttpException
        ? Object.assign(
            {
              statusCode: status,
              timestamp: new Date().toISOString(),
              path: request.url,
              method: request.method,
            },
            error['response'],
          )
        : Object.assign(
            {
              statusCode: status,
              timestamp: new Date().toISOString(),
              path: request.url,
              method: request.method,
            },
            message,
          );

          
          

    response.status(status).json(errorObj);
  }
}
