import DOMPurify from 'dompurify';

/**
 * Sanitizes rich-text HTML before it is injected with dangerouslySetInnerHTML.
 *
 * Blog posts, case studies and service descriptions are authored in the CMS
 * and rendered as raw HTML on public pages. Without this, anyone who can
 * publish content — or anyone who compromises a content-writer account — can
 * store a `<script>` or an `onerror` handler that then runs in every
 * visitor's browser.
 *
 * The allowlist covers what the CMS rich-text editor can produce; anything
 * else is stripped rather than escaped, so malformed input degrades to plain
 * text instead of breaking the page.
 */
const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr', 'span', 'div',
  'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel',
  'src', 'alt', 'title', 'width', 'height', 'loading',
  'class', 'colspan', 'rowspan',
];

export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return '';

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Block javascript:, data: and other script-bearing URL schemes.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
    // <svg> and <math> can smuggle script through foreign-content parsing.
    USE_PROFILES: { html: true },
  });
}

/**
 * Forces external links opened in a new tab to carry rel="noopener", so the
 * opened page cannot reach back through window.opener.
 */
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});
