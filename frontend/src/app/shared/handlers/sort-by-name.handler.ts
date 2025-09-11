import { User } from "../../models/user.model";

export const sortByName = (a: User, b: User) =>
  a.username.localeCompare(b.username);
