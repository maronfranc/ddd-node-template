import { authException } from "../../../../domain/auth/auth.exception";
import { INVALID_DATE } from "../../../../domain/library/common/constants";
import { DomainException, HasError } from "../../../../domain/library/exceptions/domain.exception";
import { jsonSchema } from "../../../../domain/library/exceptions/json-schema";

export interface IRegisterUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
}

class RegisterUserDto implements IRegisterUserDto {
  public email: IRegisterUserDto['email'];
  public password: IRegisterUserDto['password'];
  public firstName: IRegisterUserDto['firstName'];
  public lastName: IRegisterUserDto['lastName'];
  public birthDate: IRegisterUserDto['birthDate'];

  public constructor(user: IRegisterUserDto) {
    this.email = user.email.trim().toLowerCase();
    if (!new RegExp(jsonSchema.auth.email.pattern).test(this.email)) {
      throw new DomainException(authException['invalid-credentials']);
    }
    if (
      typeof user.password !== 'string' ||
      user.password.length < jsonSchema.auth.password.minLength
    ) {
      throw new DomainException(authException['invalid-credentials']);
    }
    if (
      !user.birthDate ||
      new Date(user.birthDate).toString() === INVALID_DATE
    ) {
      throw new DomainException(authException["invalid-birth-date"]);
    }
    if (typeof user.firstName !== 'string') {
      throw new DomainException(authException["invalid-first-name"]);
    }
    if (typeof user.lastName !== 'string') {
      throw new DomainException(authException["invalid-last-name"]);
    }
    this.password = user.password;
    this.birthDate = user.birthDate;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}

export function validateRegisterUserDto(user: IRegisterUserDto): HasError<RegisterUserDto> {
  try {
    return { result: new RegisterUserDto(user) };
  } catch (error: any) {
    return { error };
  }
}
