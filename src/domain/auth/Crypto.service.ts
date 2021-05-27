import bcrypt from 'bcrypt';
import { IUserModel } from '../../infrastructure/mongo/user';

export class CryptoService {
  private SALT_ROUNDS = 10;
  public async hash(unhashedPassword: string, salt: string): Promise<string> {
    return bcrypt.hash(unhashedPassword, salt);
  }
  public async genSalt(saltRounds = this.SALT_ROUNDS): Promise<string> {
    return bcrypt.genSalt(saltRounds);
  }
  public async compareUserPasswords(
    unhashedPassword: string,
    user: Pick<IUserModel, 'salt' | 'password'>
  ): Promise<boolean> {
    if (!user.password || !user.salt) throw new Error('Internal server error');
    const cryptoService = new CryptoService();
    const password = await cryptoService.hash(unhashedPassword, user.salt);
    return password === user.password;
  }
}