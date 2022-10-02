const namespace = process.env.AUTH0_NAMESPACE;
const roles = Symbol(namespace + '/roles');
const mysqlUser = Symbol(namespace + '/mysqlUser');

export type MysqlUser = {
  id: number;
  username_updated_at: string;
  email_updated_at: string;
  password_updated_at: string;
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

export type DataToUpdate = {
  username?: string;
  email?: string;
  password?: string;
  user_metadata: {
    username_updated_at?: string;
    email_updated_at?: string;
    password_updated_at?: string;
  };
};
