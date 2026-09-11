import { SetMetadata } from '@nestjs/common';

export const SKIP_TRANSFORM_KEY = 'skipTransform';

/**
 * Opts a route out of the global response envelope.
 *
 * Almost every endpoint returns JSON and should be wrapped, but a few must
 * return a raw body: sitemap.xml is XML, and wrapping it in
 * `{ success, data: "<?xml..." }` makes it unparseable to crawlers.
 */
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true);
