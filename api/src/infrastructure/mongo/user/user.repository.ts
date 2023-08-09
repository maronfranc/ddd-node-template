import { IUser } from '../../entity-interfaces/user.interface';
import { IUserSensitiveData } from '../../interfaces/user.interface';
import { BaseRepository } from '../base.repository';
import { IObjectBoolean } from '../interfaces/object-boolean.interface';
import UserSchema from './user.schema';

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserSchema);
  }
  public async findSensitiveData(email: string): Promise<Pick<IUser, "email"> & IUserSensitiveData | null> {
    const select = <IObjectBoolean<IUser>>{
      email: true,
      salt: true,
      password: true
    };
    return super.findOne({ email }, { select });
  }
}

export default new UserRepository();
