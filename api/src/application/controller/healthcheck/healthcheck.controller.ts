import { configuration } from '../../../environment';
import { Controller, Get } from '../../library/decorators';

@Controller('healthcheck')
export class HealthcheckController {
  @Get()
  public async healthcheck() {
    const health = {
      status: 'OK',
      date: new Date().toISOString(),
      envbuild: configuration.build,
      dbconnected: 'TODO',
    };
    return health;
  }

  @Get('ping')
  public async ping() {
    return { status: 'READY' }
  }
}
