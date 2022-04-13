import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const GetWsData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    const resultData = ctx.switchToWs().getData();
    console.log('client: ', client, 'resultData: ', resultData);
  },
);

export const GetJwtFromWsClient = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const jwt: string = ctx.switchToWs().getClient().handshake.auth.token;
    // console.log('jwt: ', jwt);
    return jwt;
  },
);
