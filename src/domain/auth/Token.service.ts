import jwt from 'jsonwebtoken';
import { configuration } from '../../config/environment';
import { IUser } from '../../infrastructure/mongo/user';

export class TokenService {
  public verifyToken(token: string) {
    return jwt.verify(token, configuration.jwt.privateKey);
  }
  public async generateToken(payload: IUser) {
    return jwt.sign(payload, configuration.jwt.privateKey, {
      expiresIn: configuration.jwt.expiresIn
    });
  }
}