import jwt from 'jsonwebtoken';
import { configuration } from '../../config/environment';
import { ISafeUserData } from './interfaces/IUserSensitiveData';

export class TokenService {
  public verifyToken(token: string) {
    return jwt.verify(token, configuration.jwt.privateKey);
  }
  public async generateToken(payload: ISafeUserData) {
    return jwt.sign(payload, configuration.jwt.privateKey, {
      expiresIn: configuration.jwt.expiresIn
    });
  }
}