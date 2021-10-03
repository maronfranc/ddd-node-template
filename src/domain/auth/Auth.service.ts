import { Infrastructure } from '../../infrastructure/Infrastructure';
import { IUser, IUserModel } from '../../infrastructure/mongo/user';
import { DomainException } from '../library/exceptions/domain.exception';
import { userException } from '../user/user.exception';
import { authException } from './auth.exception';
import { CryptoService } from './Crypto.service';
import { ICredentials } from "./interfaces/ICredentials";
import { TokenService } from './Token.service';

export class AuthService {
  public constructor(
    public readonly userRepository = new Infrastructure.repositories.User()
  ) { }
  public async registerUser(user: IUserModel): Promise<IUser> {
    if (!user.password) throw new DomainException(authException['invalid-password']);
    const emailExists = await this.userRepository.exists({ email: user.email });
    if (emailExists) throw new DomainException(authException['email-already-exists']);
    const cryptoService = new CryptoService();
    user.salt = await cryptoService.genSalt();
    user.password = await cryptoService.hash(user.password, user.salt);
    const createdUser = await this.userRepository.create(user);
    return this.deleteUserSensitiveData(createdUser);
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
  public async generateToken(user: IUser) {
    const tokenService = new TokenService();
    return tokenService.generateToken(user);
  }
  private async handleLoginSensitiveData(
    email: string,
    unhashedPassword: string | null
  ): Promise<void | never> {
    if (!unhashedPassword) throw new DomainException(authException['invalid-credentials']);
    let userWithSensitiveData = await this.userRepository.findSensitiveData(email);
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
