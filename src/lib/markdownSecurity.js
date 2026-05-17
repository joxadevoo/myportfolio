const allowedProtocols = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export function safeMarkdownUrl(url) {
  if (typeof url !== 'string') return '';

  const trimmed = url.trim();
  const hasUnsafeCharacter = [...trimmed].some((char) => {
    const code = char.charCodeAt(0);
    return code <= 32 || code === 127;
  });

  if (!trimmed || hasUnsafeCharacter) return '';
  if (trimmed.startsWith('#')) return trimmed;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;

  try {
    const parsed = new URL(trimmed, 'https://example.com');
    return allowedProtocols.has(parsed.protocol) ? trimmed : '';
  } catch {
    return '';
  }
}
