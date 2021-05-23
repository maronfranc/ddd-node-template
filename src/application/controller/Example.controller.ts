import { Req, Res } from "../Express.interfaces";
import { Controller } from "../library/decorators/controller.decorator";
import { Get } from "../library/decorators/request-mapping.decorator";

@Controller("/example")
export class ExampleController {
    @Get("/simple")
    public async simpleGetExample(req: Req, res: Res): Promise<void> {
        res.status(200).send({
            ok: true
        });
    }
    @Get({
        path: "middleware-example",
        middlewares: [
            (req, res, next) => {
                next();
            }
        ]
    })
    public async middlewareExample(req: Req, res: Res): Promise<void> {
        res.status(200).send({
            ok: true
        });
    }
}
