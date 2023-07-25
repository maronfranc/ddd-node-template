import { BaseRepository } from '../base.repository';
import { IExampleSubRef } from './example-sub-ref.interface';
import ExampleSubRefSchema from './example-sub-ref.schema';

class ExampleSubRefRepository extends BaseRepository<IExampleSubRef> {
    constructor() {
        super(ExampleSubRefSchema);
    }
}

export default new ExampleSubRefRepository();
