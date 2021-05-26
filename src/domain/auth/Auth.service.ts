import { IUser, UserRepository } from '../../infrastructure/mongo/user';
import { ISafeUserData } from './interfaces/IUserSensitiveData';
import { CryptoService } from './Crypto.service';
import { TokenService } from './Token.service';
import { ICredentials } from "./interfaces/ICredentials";

export class AuthService {
  public async registerUser(user: IUser): Promise<ISafeUserData> {
    if (!user.password) throw new Error('Missing password');
    const userRepository = new UserRepository();
    const emailExists = await userRepository.exists({ email: user.email });
    if (emailExists) throw new Error('Email already exists');
    const cryptoService = new CryptoService();
    const salt = await cryptoService.genSalt();
    const password = await cryptoService.hash(user.password, salt);
    user.password = password;
    user.salt = salt;
    const createdUser = await userRepository.create(user);
    return this.deleteUserSensitiveData(createdUser);
  }
  public async login({
    email,
    password: unhashedPassword
  }: ICredentials): Promise<{ token: string }> {
    const userRepository = new UserRepository();
    await this.handleLoginSensitiveData(userRepository, email, unhashedPassword);
    unhashedPassword = null;
    const user = await userRepository.findOne({
      email
    }) as any;
    const tokenService = new TokenService();
    const token = await tokenService.generateToken({ ...user });
    return { token };
  }
  private async handleLoginSensitiveData(
    userRepository: UserRepository,
    email: string,
    unhashedPassword: string | null
  ): Promise<void | never> {
    if (!unhashedPassword) throw new Error('Invalid credentitals');
    let userWithSensitiveData = await userRepository.findSensitiveData(email);
    if (!userWithSensitiveData) throw new Error('User not found');
    if (!userWithSensitiveData.password || !userWithSensitiveData.salt) {
      throw new Error('Internal server error');
    }
    const cryptoService = new CryptoService();
    const isPasswordCorrect = await cryptoService.compareUserPasswords(unhashedPassword, userWithSensitiveData);
    if (!isPasswordCorrect) throw new Error('Invalid credentials');
    unhashedPassword = null;
    this.deleteUserSensitiveData(userWithSensitiveData);
  }
  private deleteUserSensitiveData(user: Partial<IUser>): ISafeUserData {
    const safeUser = { ...user };
    delete safeUser.password;
    delete safeUser.salt;
    delete safeUser.person?.cpf;
    return safeUser as ISafeUserData;
  }
}
