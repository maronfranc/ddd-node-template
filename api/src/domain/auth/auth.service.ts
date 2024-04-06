import infrastructure from '../../infrastructure/Infrastructure';
import { IUser } from '../../infrastructure/entity-interfaces/user.interface';
import { IUserWithOmittedData } from '../../infrastructure/interfaces/user.interface';
import { IObjectBoolean } from '../../infrastructure/mongo/interfaces/object-boolean.interface';
import { HasError } from '../library/exceptions/domain.exception';
import { domainException } from '../library/exceptions/exception-map';
import { userException } from '../user/user.exception';
import { authException } from './auth.exception';
import cryptoService from './crypto.service';
import { ICredentials } from "./interfaces/credentials.interface";
import tokenService from './token.service';

class AuthService {
  private readonly userRepository = infrastructure.repositories.user

  public async registerUser(user: IUser): Promise<HasError<IUserWithOmittedData>> {
    if (!user.password) {
      return { error: authException['invalid-password'] };
    }

    const emailExists = await this.userRepository.exists({ email: user.email });
    if (emailExists) {
      return { error: authException['email-already-exists'] };
    }

    user.salt = await cryptoService.genSalt();
    user.password = await cryptoService.hash(user.password, user.salt);
    const createdUser = await this.userRepository.create(user);

    return { result: this.cleanUserSensitiveData(createdUser) }
  }

  public async login(credential: ICredentials): Promise<HasError<{ token: string }>> {
    const { email, password } = credential;
    await this.handleLoginSensitiveData(email, password);
    credential.password = null;

    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return { error: userException['user-by-email-not-found'] };
    }

    const token = await tokenService.generateToken({ ...user });
    return { result: { token } };
  }

  public async generateToken(user: IUserWithOmittedData) {
    return tokenService.generateToken(user);
  }

  private async handleLoginSensitiveData(
    email: string,
    unhashedPassword: string | null
  ): Promise<HasError<undefined>> {
    if (!unhashedPassword) {
      return { error: authException['invalid-credentials'] };
    }

    let userWithSensitiveData = await this.userRepository.findOne(
      { email },
      { select: <IObjectBoolean<IUser>>{ email: true, salt: true, password: true } }
    );

    if (!userWithSensitiveData) {
      return { error: authException['user-email-not-found'] };
    }
    if (!userWithSensitiveData.password || !userWithSensitiveData.salt) {
      return { error: domainException['internal-server-error'] };
    }

    const isPasswordCorrect = await cryptoService.compareUserPasswords(
      unhashedPassword,
      userWithSensitiveData
    );
    if (!isPasswordCorrect) {
      return { error: authException['invalid-credentials'] };
    }

    unhashedPassword = null;
    this.deleteUserSensitiveData(userWithSensitiveData);
    return { result: undefined }
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

export default new AuthService();
