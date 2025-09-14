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

export interface LoginResponsePayload {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: IUser;
}
