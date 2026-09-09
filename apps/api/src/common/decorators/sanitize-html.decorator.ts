import { Transform } from 'class-transformer';
import sanitizeHtmlLib from 'sanitize-html';

/**
 * Strips scripts and event handlers from a rich-text field as it is validated.
 *
 * The frontends also sanitize on render, but doing it here means hostile
 * markup never reaches the database — so it cannot leak through Swagger, a
 * future mobile client, an export, or a templated email, none of which run
 * DOMPurify.
 *
 * The allowlist mirrors `lib/sanitize.ts` in the frontends; keep them in step.
 */
const OPTIONS: sanitizeHtmlLib.IOptions = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr', 'span', 'div',
    'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    '*': ['class'],
    td: ['colspan', 'rowspan'],
    th: ['colspan', 'rowspan'],
  },
  // Anything not listed here (javascript:, data:) is dropped.
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https', 'data'] },
  // Force external links to be safe to open.
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs:
        attribs.target === '_blank'
          ? { ...attribs, rel: 'noopener noreferrer' }
          : attribs,
    }),
  },
};

export function sanitizeRichText(value: string): string {
  return sanitizeHtmlLib(value, OPTIONS);
}

/** Field decorator: sanitizes incoming HTML during DTO transformation. */
export function SanitizeHtml() {
  return Transform(({ value }) =>
    typeof value === 'string' ? sanitizeRichText(value) : value,
  );
}
