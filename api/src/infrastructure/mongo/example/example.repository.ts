import { BaseRepository } from '../Base.repository';
import { IExample } from './example.interface';
import ExampleSchema from './example.schema';

export class ExampleRepository extends BaseRepository<IExample> {
    constructor() {
        super(ExampleSchema);
    }
}
