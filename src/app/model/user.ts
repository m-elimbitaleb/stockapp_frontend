
export enum RoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export class TokenUser {
  id: number;
  admin: boolean;
  username: string;
  password: string;
  lang: string;
  rememberMe: boolean;
  permissions: string[];
}

export class Token {
  authenticated: boolean;
  authToken: string;
  user: TokenUser;
  refreshToken: string;
}

export class User {
  activeUser: boolean;
  createdAt: string;
  email: string;
  firstName: string;
  phone: string;
  role: RoleEnum;
  genre: number;
  id: number;
  lastName: string;
  username: string;
}
