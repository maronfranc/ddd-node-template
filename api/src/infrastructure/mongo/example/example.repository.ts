import { IExample } from '../../entity-interfaces/example.interface';
import { BaseRepository } from '../base.repository';
import ExampleSchema from './example.schema';

class ExampleRepository extends BaseRepository<IExample> {
  constructor() {
    super(ExampleSchema);
  }
}

export default new ExampleRepository();
