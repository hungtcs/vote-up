import { ObjectID } from 'mongodb';
import { Request, Response } from 'express';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class UsernameInterceptor implements NestInterceptor {

  public intercept(context: ExecutionContext, next: CallHandler) {
    const host = context.switchToHttp();
    const request: Request = host.getRequest();
    const response: Response = host.getResponse();

    const username: string = request.cookies.username;
    if(!username) {
      const username = new ObjectID().toHexString();
      request.cookies.username = username;
      response.cookie('username', username);
    }

    return next.handle();
  }

}
