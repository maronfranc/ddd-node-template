export interface ILoginDto {
  email: string;
  password: string;
}

export class LoginDto {
  public email: string;
  public password: string;
  public constructor(login: ILoginDto) {
    this.email = login.email;
    this.password = login.password;
  }
}