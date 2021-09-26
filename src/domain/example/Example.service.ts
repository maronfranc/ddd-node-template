import { ExampleRepository, IExample } from "../../infrastructure/mongo/example";
import { CreateExampleDto } from "./create-example.dto";

export class ExampleService {
  public constructor(public exampleRepository = new ExampleRepository()) { }
  public async findExamples(condition: Partial<IExample>): Promise<IExample[]> {
    return this.exampleRepository.find(condition);
  }
  public async create(dto: CreateExampleDto): Promise<IExample> {
    return this.exampleRepository.create({ title: dto.title });
  }
}
