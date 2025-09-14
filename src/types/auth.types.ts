export interface AuthPayload {
  token: string;
  refreshToken: string;
  user: IUser;
}

export interface IUser {
  id: string;
  full_name: string;
  email: string;
  is_admin: boolean;
}
