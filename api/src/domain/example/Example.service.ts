import infrastructure from "../../infrastructure/Infrastructure";
import { IExample } from "../../infrastructure/mongo/example";
import { CreateExampleDto } from "./create-example.dto";

export class ExampleService {
  public constructor(
    public readonly exampleRepository = infrastructure.repositories.example
  ) { }
  public async findExamples(condition: Partial<IExample>): Promise<IExample[]> {
    return this.exampleRepository.find(condition);
  }
  public async create(dto: CreateExampleDto): Promise<IExample> {
    return this.exampleRepository.create({ title: dto.title });
  }
}
