import { IUserSensitiveData } from '../../../domain/auth/interfaces/IUserSensitiveData';
import { BaseRepository } from '../Base.repository';
import { IObjectBoolean } from '../interfaces/object-boolean.interface';
import { IUser } from './interfaces/user.interface';
import UserSchema from './user.schema';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserSchema);
  }
  public async findSensitiveData(email: string): Promise<Pick<IUser, "email"> & IUserSensitiveData> {
    const select = <IObjectBoolean<IUser>>{
      email: true,
      salt: true,
      password: true
    }
    return this.BaseModel
      .findOne({ email })
      .select(select)
      .lean();
  }
}
