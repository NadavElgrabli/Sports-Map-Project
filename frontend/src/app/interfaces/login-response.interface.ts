import { UserResponse } from './user-response.interface';

export interface LoginResponseData {
  expiresIn: number;
  user: UserResponse;
}
