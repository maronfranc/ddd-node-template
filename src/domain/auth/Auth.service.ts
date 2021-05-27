import { IUser, IUserModel, UserRepository } from '../../infrastructure/mongo/user';
import { DomainException } from '../library/domain.exception';
import { userException } from '../user/user.exception';
import { authException } from './auth.exception';
import { CryptoService } from './Crypto.service';
import { ICredentials } from "./interfaces/ICredentials";
import { TokenService } from './Token.service';

export class AuthService {
  public async registerUser(user: IUserModel): Promise<IUser> {
    if (!user.password) throw new DomainException(authException['invalid-password']);
    const userRepository = new UserRepository();
    const emailExists = await userRepository.exists({ email: user.email });
    if (emailExists) throw new DomainException(authException['email-already-exists']);
    const cryptoService = new CryptoService();
    const salt = await cryptoService.genSalt();
    const password = await cryptoService.hash(user.password, salt);
    user.password = password;
    user.salt = salt;
    const createdUser = await userRepository.create(user);
    return this.deleteUserSensitiveData(createdUser);
  }
  public async login({ email, password }: ICredentials): Promise<{ token: string }> {
    const userRepository = new UserRepository();
    await this.handleLoginSensitiveData(userRepository, email, password);
    password = null;
    const user = await userRepository.findOne({
      email
    });
    if (user === null) throw new DomainException(userException['user-by-email-not-found']);
    const tokenService = new TokenService();
    const token = await tokenService.generateToken({ ...user });
    return { token };
  }
  public async generateToken(user: IUser) {
    const tokenService = new TokenService();
    return tokenService.generateToken(user);
  }
  private async handleLoginSensitiveData(
    userRepository: UserRepository,
    email: string,
    unhashedPassword: string | null
  ): Promise<void | never> {
    if (!unhashedPassword) throw new DomainException(authException['invalid-credentials']);
    let userWithSensitiveData = await userRepository.findSensitiveData(email);
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
  private deleteUserSensitiveData(user: Partial<IUserModel>): IUser {
    const safeUser = { ...user };
    delete safeUser.password;
    delete safeUser.salt;
    delete safeUser.person?.cpf;
    return safeUser as IUser;
  }
}
