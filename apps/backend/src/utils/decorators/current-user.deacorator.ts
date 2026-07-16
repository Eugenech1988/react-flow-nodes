import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import type { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (key: keyof User | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user;

    if (key && user) {
      return user[key as keyof typeof user];
    }

    return user;
  }
);
