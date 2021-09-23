import { AuthService } from '../../../domain/auth/Auth.service';
import { Next, Req, ReqAuthorized, Res } from '../../express/Express.interfaces';
import { HttpStatus } from '../../http/http-status.enum';
import { Controller, Get, Post } from '../../library/decorators';
import { AuthGuard } from './Auth.guard';
import { LoginDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  @Post('register')
  public async register(req: Req, res: Res, next: Next) {
    try {
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
      return res.status(HttpStatus.CREATED).send({
        token: token,
        user: registeredUser
      });
    } catch (err) {
      next(err);
    }
  }
  @Post('login')
  public async login(req: Req, res: Res, next: Next) {
    try {
      const loginCredential = new LoginDto(req.body);
      const authService = new AuthService();
      const login = await authService.login({ ...loginCredential });
      return res.status(HttpStatus.OK).send(login);
    } catch (err) {
      next(err)
    }
  }
  @Get({
    path: 'token',
    middlewares: [AuthGuard.middleware]
  })
  public async token(req: ReqAuthorized, res: Res) {
    return res.status(HttpStatus.OK).send({
      user: req.user
    });
  }
}
