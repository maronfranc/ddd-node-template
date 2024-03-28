import { AuthService } from '../../../domain/auth/auth.service';
import { Req, ReqAuthorized, Res } from '../../express/express.interfaces';
import { Controller, Get, Post } from '../../library/decorators';
import { HttpReq, HttpRes } from '../../library/decorators/route-params';
import { HttpStatus } from '../../library/http/http-status.enum';
import { AuthGuard } from './auth.guard';
import { LoginDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  @Post('register')
  public async register(@HttpReq() req: Req) {
    const user = new RegisterUserDto(req.body)
    const authService = new AuthService();
    const registeredUser = await authService.registerUser({
      email: user.email,
      password: user.password,
      salt: "",
      person: {
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
      }
    });
    const token = await authService.generateToken(registeredUser);
    return {

      token: token,
      user: registeredUser
    }
  }
  @Post('login')
  public async login(@HttpReq() req: Req, @HttpRes() res: Res) {
    const loginCredential = new LoginDto(req.body);
    const authService = new AuthService();
    const login = await authService.login({ ...loginCredential });
    return res.status(HttpStatus.OK).send(login);
  }
  @Get({ path: 'token', middlewares: [AuthGuard.middleware] })
  public async token(@HttpReq() req: ReqAuthorized) {
    return { user: req.user };
  }
}
