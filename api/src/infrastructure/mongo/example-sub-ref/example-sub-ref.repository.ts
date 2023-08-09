import { IExampleSubRef } from '../../entity-interfaces/example-sub-ref.interface';
import { BaseRepository } from '../base.repository';
import ExampleSubRefSchema from './example-sub-ref.schema';

class ExampleSubRefRepository extends BaseRepository<IExampleSubRef> {
  constructor() {
    super(ExampleSubRefSchema);
  }
}

export default new ExampleSubRefRepository();
