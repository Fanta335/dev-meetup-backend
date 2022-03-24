const email = Symbol(process.env.AUTH0_EMAIL_NAMESPACE + '/email');

export type UserAccessToken = {
  [email]: string;
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
};
