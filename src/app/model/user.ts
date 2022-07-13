
export enum RoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export class User {
  activeUser: boolean;
  createdAt: string;
  email: string;
  firstName: string;
  phone: string;
  role: RoleEnum = RoleEnum.USER;
  genre: number;
  id: number;
  lastName: string;
  username: string;
  warehouseName: string;

}

export class TokenUser extends User {
  admin: boolean;
  rememberMe: boolean;
  permissions: string[];
}

export class Token {
  authenticated: boolean;
  authToken: string;
  user: TokenUser;
  refreshToken: string;
}
