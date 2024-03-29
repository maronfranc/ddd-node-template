import infrastructure from '../../infrastructure/Infrastructure';
import { IUser } from '../../infrastructure/entity-interfaces/user.interface';
import { IUserWithOmittedData } from '../../infrastructure/interfaces/user.interface';
import { IObjectBoolean } from '../../infrastructure/mongo/interfaces/object-boolean.interface';
import { DomainException } from '../library/exceptions/domain.exception';
import { userException } from '../user/user.exception';
import { authException } from './auth.exception';
import { CryptoService } from './crypto.service';
import { ICredentials } from "./interfaces/credentials.interface";
import { TokenService } from './token.service';

export class AuthService {
  private readonly userRepository = infrastructure.repositories.user
  public async registerUser(user: IUser): Promise<IUserWithOmittedData> {
    if (!user.password) throw new DomainException(authException['invalid-password']);
    const emailExists = await this.userRepository.exists({ email: user.email });
    if (emailExists) throw new DomainException(authException['email-already-exists']);
    const cryptoService = new CryptoService();
    user.salt = await cryptoService.genSalt();
    user.password = await cryptoService.hash(user.password, user.salt);
    const createdUser = await this.userRepository.create(user);
    return this.cleanUserSensitiveData(createdUser);
  }
  public async login({ email, password }: ICredentials): Promise<{ token: string }> {
    await this.handleLoginSensitiveData(email, password);
    password = null;
    const user = await this.userRepository.findOne({ email });
    if (user === null) throw new DomainException(userException['user-by-email-not-found']);
    const tokenService = new TokenService();
    const token = await tokenService.generateToken({ ...user });
    return { token };
  }
  public async generateToken(user: IUserWithOmittedData) {
    const tokenService = new TokenService();
    return tokenService.generateToken(user);
  }
  private async handleLoginSensitiveData(
    email: string,
    unhashedPassword: string | null
  ): Promise<void | never> {
    if (!unhashedPassword) throw new DomainException(authException['invalid-credentials']);
    let userWithSensitiveData = await this.userRepository.findOne(
      { email },
      { select: <IObjectBoolean<IUser>>{ email: true, salt: true, password: true } }
    );
    if (!userWithSensitiveData) throw new DomainException(authException['user-email-not-found']);
    if (!userWithSensitiveData.password || !userWithSensitiveData.salt) {
      throw new DomainException();
    }
    const cryptoService = new CryptoService();
    const isPasswordCorrect = await cryptoService.compareUserPasswords(
      unhashedPassword,
      userWithSensitiveData
    );
    if (!isPasswordCorrect) throw new DomainException(authException['invalid-credentials']);
    unhashedPassword = null;
    this.deleteUserSensitiveData(userWithSensitiveData);
  }
  private deleteUserSensitiveData(mutUser: Partial<IUser>): void {
    delete mutUser.password;
    delete mutUser.salt;
    delete mutUser.person?.cpf;
  }
  private cleanUserSensitiveData(user: Partial<IUser>): IUserWithOmittedData {
    const safeUser = { ...user };
    this.deleteUserSensitiveData(safeUser);
    return safeUser as IUserWithOmittedData;
  }
}
