import { IUser } from "../entity-interfaces/user.interface";

export type IUserSensitiveData = Pick<IUser, "password" | "salt">;
export type IUserWithOmittedData = Omit<IUser, keyof IUserSensitiveData>;
