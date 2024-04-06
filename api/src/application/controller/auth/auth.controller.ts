import { AuthService } from '../../../domain/auth/auth.service';
import { DomainException } from '../../../domain/library/exceptions/domain.exception';
import { ReqAuthorized } from '../../express/express.interfaces';
import { Controller, Get, Post } from '../../library/decorators';
import { Body, HttpReq } from '../../library/decorators/route-params';
import { AuthGuard } from './auth.guard';
import { ILoginDto, IRegisterUserDto, validateLoginDto, validateRegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  @Post('register')
  public async register(@Body() body: IRegisterUserDto) {
    const { error: dtoError, result: user } = validateRegisterUserDto(body)
    if (dtoError) {
      throw new DomainException(dtoError);
    }

    const authService = new AuthService();
    const { error, result: registeredUser } = await authService.registerUser({
      email: user.email,
      password: user.password,
      salt: "",
      person: {
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
      }
    });
    if (error) {
      throw new DomainException(error);
    }

    const token = await authService.generateToken(registeredUser);
    return { token: token, user: registeredUser };
  }

  @Post('login')
  public async login(@Body() body: ILoginDto) {
    const { error: dtoError, result: loginCredential } = validateLoginDto(body);
    if (dtoError) {
      throw new DomainException(dtoError);
    }

    const authService = new AuthService();
    const { error, result: login } = await authService.login(loginCredential);
    if (error) {
      throw new DomainException(error);
    }

    return login;
  }

  @Get({ path: 'token', middlewares: [AuthGuard.middleware] })
  public async token(@HttpReq() req: ReqAuthorized) {
    return { user: req.user };
  }
}
