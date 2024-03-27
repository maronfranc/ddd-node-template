import { ExampleService } from "../../../domain/example/Example.service";
import { exampleException } from "../../../domain/example/example.exception";
import { DomainException } from "../../../domain/library/exceptions/domain.exception";
import { Req, Res } from "../../express/express.interfaces";
import { Controller } from "../../library/decorators/controller.decorator";
import { Get, Post } from "../../library/decorators/request-mapping.decorator";
import { HttpStatus } from "../../library/http/http-status.enum";

@Controller("example")
export class ExampleController {
  @Get()
  public async find(_: Req, res: Res): Promise<void> {
    const exampleService = new ExampleService();
    const examples = await exampleService.findExamples({});
    res.status(HttpStatus.OK).send(examples);
  }
  @Get(':id')
  public async findById(req: Req, res: Res): Promise<void> {
    const id = req.params.id;
    const exampleService = new ExampleService();
    const example = await exampleService.findById(id);
    res.status(HttpStatus.OK).send(example);
  }
  @Post("create")
  public async create(req: Req, res: Res): Promise<void> {
    const title = req?.body?.title;
    if (!title) {
      throw new DomainException(exampleException['invalid-title']);
    }
    const exampleService = new ExampleService();
    const createdExample = await exampleService.create({ title });
    res.status(HttpStatus.OK).send(createdExample);
  }
}
