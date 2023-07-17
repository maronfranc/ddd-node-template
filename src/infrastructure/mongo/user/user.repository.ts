import { BaseRepository } from '../Base.repository';
import { IObjectBoolean } from '../interfaces/object-boolean.interface';
import { IUserModel, IUserSensitiveData } from './interfaces/user.interface';
import UserSchema from './user.schema';

export class UserRepository extends BaseRepository<IUserModel> {
  constructor() {
    super(UserSchema);
  }
  public async findSensitiveData(email: string): Promise<Pick<IUserModel, "email"> & IUserSensitiveData | null> {
    const select = <IObjectBoolean<IUserModel>>{
      email: true,
      salt: true,
      password: true
    };
    return this.BaseModel
      .findOne({ email })
      .select(select)
      .lean();
  }
}
