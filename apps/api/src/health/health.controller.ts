import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Liveness: the process is up and serving. Does not touch the database, so
   * it stays green during a database outage and will not cause a restart loop.
   */
  @Get('health')
  @ApiOperation({ summary: 'Liveness probe' })
  health() {
    return {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness: the process can actually serve traffic, which means the
   * database is reachable. Returns 503 when it is not.
   */
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe (checks the database)' })
  async ready() {
    const startedAt = Date.now();
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: 'ready',
      database: { reachable: true, latencyMs: Date.now() - startedAt },
      timestamp: new Date().toISOString(),
    };
  }
}
