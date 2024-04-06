import tokenService from "../../../domain/auth/token.service";
import { DomainException } from "../../../domain/library/exceptions/domain.exception";
import { headerException } from "../../../domain/library/exceptions/header.exception";
import { IUserWithOmittedData } from "../../../infrastructure/interfaces/user.interface";
import { Next, ReqAuthorized, Res } from "../../fastify/fastify.interface";

export class AuthGuard {
  static middleware(req: ReqAuthorized, _res: Res, next: Next) {
    const bearerToken = req.headers['authorization'];
    if (!bearerToken) {
      throw new DomainException(headerException["bearer-token-not-provided"]);
    }

    try {
      const [, token] = bearerToken.split(' ');
      const tokenUser = tokenService.verifyToken(token) as IUserWithOmittedData;
      req.user = tokenUser;
      next();
    } catch (error) {
      throw new DomainException(headerException["bearer-token-invalid-credentials"])
    }
  }
}
