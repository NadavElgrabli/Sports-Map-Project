import { UserResponse } from "../../interfaces/user-response.interface";

export type LoggedUser = UserResponse & { expirationDate: Date };
