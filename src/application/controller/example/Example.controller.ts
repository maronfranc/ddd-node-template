import { ExampleService } from "../../../domain/example/Example.service";
import { Req, Res } from "../../Express.interfaces";
import { Controller } from "../../library/decorators/controller.decorator";
import { Get, Post } from "../../library/decorators/request-mapping.decorator";

@Controller("example")
export class ExampleController {
  @Get()
  public async find(_req: Req, res: Res): Promise<void> {
    const exampleService = new ExampleService();
    const examples = await exampleService.findExamples({});
    res.status(200).send({
      examples
    });
  }
  @Post("create")
  public async create(req: Req, res: Res): Promise<void> {
    const title = req.body.title;
    const exampleService = new ExampleService();
    const createdExample = exampleService.create({
      title,
    })
    res.status(200).send({
      example: createdExample
    });
  }
}
