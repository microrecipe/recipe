import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserType } from 'src/recipes.interface';

export const UserPayload = createParamDecorator(
  (data: any, context: ExecutionContext): UserType => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
