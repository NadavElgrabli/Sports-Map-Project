import { Location } from './location.interface';

//TODO: seperate to 2 files
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


//TODO: create a type for a user
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
