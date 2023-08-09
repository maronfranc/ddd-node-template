import jwt from 'jsonwebtoken';
import { configuration } from '../../environment';
import { IUserWithOmittedData } from '../../infrastructure/interfaces/user.interface';

export class TokenService {
  public verifyToken(token: string) {
    return jwt.verify(token, configuration.jwt.privateKey);
  }
  public async generateToken(payload: IUserWithOmittedData) {
    return jwt.sign(payload, configuration.jwt.privateKey, {
      expiresIn: configuration.jwt.expiresIn
    });
  }
}