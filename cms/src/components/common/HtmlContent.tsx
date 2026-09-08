/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useMemo } from 'react';

interface HtmlContentProps {
  html?: string | null;
  className?: string;
}

const decodeHtmlEntities = (value: string) => {
  if (!value) return '';

  if (typeof window === 'undefined') {
    return value;
  }

  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
};

function HtmlContent({ html = '', className = '' }: HtmlContentProps) {
  const content = useMemo(() => decodeHtmlEntities(html), [html]);

  return (
    <div
      className={[
        'rich-text-content prose prose-sm max-w-none',
        'prose-p:my-2 prose-headings:font-semibold prose-headings:text-text-dark',
        'prose-a:text-primary-red prose-strong:font-semibold prose-ul:my-3 prose-ol:my-3',
        className,
      ].filter(Boolean).join(' ')}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default memo(HtmlContent);
