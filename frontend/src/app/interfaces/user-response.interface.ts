import { Location } from './location.interface';

//TODO(DONE): seperate to 2 files
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
