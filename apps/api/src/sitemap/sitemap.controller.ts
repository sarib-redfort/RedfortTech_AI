import { Controller, Get, Header } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { SitemapService } from './sitemap.service';
import { SkipTransform } from '../common/decorators/skip-transform.decorator';

@Controller()
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  /**
   * Served under the public prefix so the website can proxy /sitemap.xml to it.
   *
   * Throttling is skipped because crawlers fetch this on their own schedule
   * and a 429 would drop pages out of the index.
   */
  @Get('public/sitemap.xml')
  @ApiExcludeEndpoint()
  @SkipThrottle()
  @SkipTransform()
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  generate(): Promise<string> {
    return this.sitemapService.generate();
  }
}
