import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from './recipes.interface';

export const UserPayload = createParamDecorator(
  (data: any, context: ExecutionContext): TokenPayload => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
