export interface IRegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
}

export class RegisterUserDto implements IRegisterUserDto {
  public email: IRegisterUserDto['email'];
  public password: IRegisterUserDto['password'];
  public firstName: IRegisterUserDto['firstName'];
  public lastName: IRegisterUserDto['lastName'];
  public birthDate: IRegisterUserDto['birthDate'];
  public constructor(user: IRegisterUserDto) {
    this.email = user.email;
    this.password = user.password;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.birthDate = user.birthDate;
  }
}