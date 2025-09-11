import { User } from '../../models/user.model';

export const sortByWeight = (a: User, b: User) =>
  Number(a.weight) - Number(b.weight);
