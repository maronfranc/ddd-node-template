import { BaseRepository } from '../base.repository';
import { IObjectBoolean } from '../interfaces/object-boolean.interface';
import { IUserModel, IUserSensitiveData } from './interfaces/user.interface';
import UserSchema from './user.schema';

class UserRepository extends BaseRepository<IUserModel> {
  constructor() {
    super(UserSchema);
  }
  public async findSensitiveData(email: string): Promise<Pick<IUserModel, "email"> & IUserSensitiveData | null> {
    const select = <IObjectBoolean<IUserModel>>{
      email: true,
      salt: true,
      password: true
    };
    return super.findOne({ email }, { select });
  }
}

export default new UserRepository();
