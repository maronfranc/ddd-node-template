import { TokenService } from "../../../domain/auth";
import { headerException } from "../../../domain/library/header.exception";
import { IUser } from "../../../infrastructure/mongo/user";
import { Next, ReqAuthorized, Res } from "../../Express.interfaces";

export class AuthGuard {
  static middleware(
    req: ReqAuthorized,
    res: Res,
    next: Next
  ) {
    const bearerToken = req.header('authorization');
    if (!bearerToken) {
      return res.status(401).json(headerException["bearer-token-not-provided"]);
    }
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
