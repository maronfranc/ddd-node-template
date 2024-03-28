import { ExampleService } from "../../../domain/example/Example.service";
import { exampleException } from "../../../domain/example/example.exception";
import { DomainException } from "../../../domain/library/exceptions/domain.exception";
import { Controller } from "../../library/decorators/controller.decorator";
import { Get, Post } from "../../library/decorators/request-mapping.decorator";
import { Body, Param } from "../../library/decorators/route-params";

@Controller("example")
export class ExampleController {
  @Get()
  public async find() {
    const exampleService = new ExampleService();
    const examples = await exampleService.findExamples({});
    return examples;
  }
  @Get(':id')
  public async findById(@Param('id') id: string) {
    const exampleService = new ExampleService();
    const example = await exampleService.findById(id);
    return example
  }
  @Post("create")
  public async create(@Body() body: { title: string }) {
    const title = body.title;
    if (!title) {
      throw new DomainException(exampleException['invalid-title']);
    }
    const exampleService = new ExampleService();
    const createdExample = await exampleService.create({ title });
    return createdExample
  }
}
