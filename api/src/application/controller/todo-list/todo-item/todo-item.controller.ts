import { Next, Req, Res } from "../../../express/express.interfaces";
import { Controller, Patch, Post, Delete } from "../../../library/decorators";
import { HttpStatus } from "../../../library/http/http-status.enum";


@Controller("todo-list/item")
export class TodoItemController {
  @Post()
  public async createMany(req: Req, res: Res): Promise<void> {
    res.status(HttpStatus.OK).send({ ok: true });
  }
  @Patch("/many/:ids")
  public async updateMany(req: Req, res: Res, next: Next): Promise<void> {
    const ids = req.params.ids;
    res.status(HttpStatus.OK).send({ ok: true, ids });
  }
  @Delete("/many/:ids")
  public async deleteMany(req: Req, res: Res): Promise<void> {
    const ids = req.params.ids;
    res.status(HttpStatus.OK).send({ ok: true, ids });
  }
}
