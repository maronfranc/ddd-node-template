import { ExampleRepository, IExample } from "../../infrastructure/mongo/example";
import { CreateExampleDto } from "./create-example.dto";

export class ExampleService {
  public async findExamples(condition: Partial<IExample>): Promise<IExample[]> {
    const exampleRepository = new ExampleRepository();
    return exampleRepository.find(condition);
  }
  public async create(dto: CreateExampleDto): Promise<IExample> {
    const exampleRepository = new ExampleRepository();
    return exampleRepository.create({
      title: dto.title,
    });
  }
}
