import { Location } from '../interfaces/location.interface';

export class User {
  constructor(
    public id: number,
    public username: string,
    public password: string,
    public dateOfBirth: string,
    public weight: number,
    public address: string,
    public expiresIn: number,
    public expirationDate: Date,
    public currentLocation: Location = { latitude: 0, longitude: 0 },
    public friends: number[] = []
  ) {}

  get isActive() {
    return !!this.expirationDate && new Date() <= this.expirationDate;
  }
}
