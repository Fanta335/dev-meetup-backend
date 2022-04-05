const namespace = process.env.AUTH0_NAMESPACE;
const roles = Symbol(namespace + '/roles');
const mysqlUser = Symbol(namespace + '/mysqlUser');

export type MysqlUser = {
  id: number;
  subId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type UserAccessToken = {
  [roles]: string[];
  [mysqlUser]: MysqlUser;
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  permissions: string[];
};
