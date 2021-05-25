import { BaseRepository } from '../Base.repository';
import { IExampleSubRef } from './example-sub-ref.interface';
import ExampleSubRefSchema from './example-sub-ref.schema';

export class ExampleSubRefRepository extends BaseRepository<IExampleSubRef> {
    constructor() {
        super(ExampleSubRefSchema);
    }
}
