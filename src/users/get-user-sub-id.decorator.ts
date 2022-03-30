import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserSubId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // remove 'auth0|' prefix
    const prefix = 'auth0|';
    return request.user.sub.slice(prefix.length);
  },
);
