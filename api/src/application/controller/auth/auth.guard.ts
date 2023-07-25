import { TokenService } from "../../../domain/auth";
import { headerException } from "../../../domain/library/exceptions/header.exception";
import { IUser } from "../../../infrastructure/mongo/user";
import { Next, ReqAuthorized, Res } from "../../express/express.interfaces";
import { HttpStatus } from "../../library/http/http-status.enum";

export class AuthGuard {
  static middleware(
    req: ReqAuthorized,
    res: Res,
    next: Next
  ) {
    const bearerToken = req.header('authorization');
    if (!bearerToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(headerException["bearer-token-not-provided"]);
    }
    try {
      const tokenService = new TokenService();
      const [, token] = bearerToken.split(' ');
      const tokenUser = tokenService.verifyToken(token) as IUser;
      req.user = tokenUser;
      next();
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json(headerException["bearer-token-invalid-credentials"]);
    }
  }
}
