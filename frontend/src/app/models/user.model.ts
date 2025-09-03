export interface Location {
  latitude: number;
  longitude: number;
}

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
    public friends: User[] = []
  ) {}

  get isActive() {
    if (!this.expirationDate || new Date() > this.expirationDate) {
      return false;
    }
    return true;
  }
}
