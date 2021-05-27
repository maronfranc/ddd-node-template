import { AuthService } from '../../../domain/auth/Auth.service';
import { Req, ReqAuthorized, Res } from '../../Express.interfaces';
import { Controller, Get, Post } from '../../library/decorators';
import { AuthGuard } from './Auth.guard';
import { LoginDto, RegisterUserDto } from './dto';

@Controller('auth')
export class AuthController {
  @Post('register')
  public async register(req: Req, res: Res) {
    const user = new RegisterUserDto(req.body)
    const authService = new AuthService();
    try {
      const registeredUser = await authService.registerUser({
        email: user.email,
        password: user.password,
        salt: "",
        person: {
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
      res.status(200).send(registeredUser);
    } catch (err) {
      res.status(500);
    }
  }
  @Post('login')
  public async login(req: Req, res: Res) {
    const loginCredential = new LoginDto(req.body);
    const authService = new AuthService();
    const login = await authService.login({ ...loginCredential });
    res.status(200).send(login);
  }
  @Get({
    path: 'token',
    middlewares: [AuthGuard.middleware]
  })
  public async token(req: ReqAuthorized, res: Res) {
    res.status(200).send({
      user: req.user
    });
  }
}
