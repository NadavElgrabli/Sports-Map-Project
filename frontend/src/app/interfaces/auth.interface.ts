import { User } from '../models/user.model';
import { Location } from './location.interface';

export interface SignUpResponseData {
  id: number;
  username: string;
  password: string;
  dateOfBirth: string;
  weight: number;
  address: string;
  currentLocation: Location;
  friends: number[]; 
}

export interface LoginResponseData {
  expiresIn: number;
  user: {
    id: number;
    username: string;
    password: string;
    dateOfBirth: string;
    weight: number;
    address: string;
    currentLocation: Location;
    friends: number[]; 
  };
}
