import { IUser } from '../../entity-interfaces/user.interface';
import { BaseRepository } from '../base.repository';
import UserSchema from './user.schema';

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserSchema);
  }
}

export default new UserRepository();
