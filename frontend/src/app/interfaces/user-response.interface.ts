import { Location } from './location.interface';

export interface UserResponse {
  id: number;
  username: string;
  password: string;
  dateOfBirth: string;
  weight: number;
  address: string;
  currentLocation: Location;
  friends: number[];
}
