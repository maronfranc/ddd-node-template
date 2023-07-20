import { configuration } from '../../../environment';
import { Req, Res } from '../../express/Express.interfaces';
import { Controller, Get } from '../../library/decorators';
import { HttpStatus } from '../../library/http/http-status.enum';

@Controller('healthcheck')
export class HealthcheckController {
  @Get()
  public async healthcheck(_req: Req, res: Res) {
    const health = {
      status: 'OK',
      date: new Date().toISOString(),
      envbuild: configuration.build,
      dbconnected: 'TODO',
    };
    return res.status(HttpStatus.OK).send(health);
  }

  @Get('ready')
  public async ping(_req: Req, res: Res) {
    const health = { status: 'READY' };
    return res.status(HttpStatus.OK).send(health);
  }
}
