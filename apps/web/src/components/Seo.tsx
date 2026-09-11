import { companyInfo } from '../data/company';

const SITE_NAME = companyInfo.name;
const DEFAULT_DESCRIPTION = companyInfo.description;

/**
 * Per-page document metadata.
 *
 * React 19 hoists `<title>`, `<meta>` and `<link>` into `<head>` from anywhere
 * in the tree, so this needs no helmet library. Before this existed every
 * route shared the single static title in index.html, which meant search
 * results and link previews were identical for all twelve pages.
 *
 * Note this is a client-rendered app: crawlers that do not execute JavaScript
 * see only the shell. Correct tags are a prerequisite for indexing, not a
 * substitute for server rendering or prerendering.
 */
interface SeoProps {
  /** Page title, without the site name — that is appended automatically. */
  title?: string;
  description?: string;
  /** Absolute URL of the social preview image. */
  image?: string;
  /** "article" for blog posts and case studies, "website" otherwise. */
  type?: 'website' | 'article';
  /** Keeps a page out of search results (e.g. a not-found view). */
  noIndex?: boolean;
  /** ISO date, article pages only. */
  publishedTime?: string;
  author?: string;
}

/** Absolute URL of the current page, used for canonical and og:url. */
function currentUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin + window.location.pathname;
}

export function Seo({
  title,
  description,
  image,
  type = 'website',
  noIndex = false,
  publishedTime,
  author,
}: SeoProps) {
  // Titles read "Page | RedFort AI"; the home page is just the site name.
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const metaDescription = (description || DEFAULT_DESCRIPTION).slice(0, 300);
  const url = currentUrl();

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {url && <link rel="canonical" href={url} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph — used by LinkedIn, Facebook, Slack and most chat apps. */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}

      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
    </>
  );
}

export default Seo;
