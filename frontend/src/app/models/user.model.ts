export class User {
  constructor(
    public id: number,
    public username: string,
    public password: string,
    public dateOfBirth: string,
    public weight: number,
    public address: string,
    public expiresIn: number,
    public expirationDate: Date
  ) {}

  get isActive() {
    if (!this.expirationDate || new Date() > this.expirationDate) {
      return false;
    }
    return true;
  }
}
