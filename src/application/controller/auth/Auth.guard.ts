import { TokenService } from "../../../domain/auth";
import { IUser } from "../../../infrastructure/mongo/user";
import { Next, ReqAuthorized, Res } from "../../Express.interfaces";

export class AuthGuard {
  static middleware(
    req: ReqAuthorized,
    res: Res,
    next: Next
  ) {
    const bearerToken = req.header('authorization');
    if (!bearerToken) return res.status(401).json({
      error: 'Authorization required'
    });
    try {
      const tokenService = new TokenService();
      const [, token] = bearerToken.split(' ');
      const tokenUser = tokenService.verifyToken(token) as IUser;
      req.user = tokenUser;
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid credentials' })
    }
  }
}
