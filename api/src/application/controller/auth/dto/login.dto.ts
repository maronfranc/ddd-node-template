import { authException } from "../../../../domain/auth/auth.exception";
import { DomainException, HasError } from "../../../../domain/library/exceptions/domain.exception";
import { jsonSchema } from "../../../../domain/library/exceptions/json-schema";

export interface ILoginDto {
  email: string;
  password: string;
}

class LoginDto {
  public email: string;
  public password: string;
  public constructor(login: ILoginDto) {
    this.email = login.email.trim().toLowerCase();
    if (!new RegExp(jsonSchema.auth.email.pattern).test(this.email)) {
      throw new DomainException(authException['invalid-credentials']);
    }
    if (
      typeof login.password !== 'string' ||
      login.password.length < jsonSchema.auth.password.minLength
    ) {
      throw new DomainException(authException['invalid-credentials']);
    }
    this.password = login.password;
  }
}

export function validateLoginDto(login: ILoginDto): HasError<LoginDto> {
  try {
    return { result: new LoginDto(login) };
  } catch (error: any) {
    return { error };
  }
}
