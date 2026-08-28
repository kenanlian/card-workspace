/* Chrome copy and links shared by the landing page and the docs header. */

export type Locale = 'en' | 'zh';

export const VERSION = '1.1.8';

/* Must match `base` in astro.config.mjs. */
export const BASE = '/card-workspace';

export const REPO = 'https://github.com/kenanlian/obsidian-card-workspace';
export const RELEASES = `${REPO}/releases`;
export const COMMUNITY_PLUGIN = 'https://community.obsidian.md/plugins/card-workspace';

export const repoLabel: Record<Locale, string> = {
  en: 'GitHub repository',
  zh: 'GitHub 仓库',
};

export const versionTitle: Record<Locale, string> = {
  en: `Card Workspace ${VERSION} on GitHub Releases`,
  zh: `在 GitHub Releases 查看 Card Workspace ${VERSION}`,
};

export function toLocale(lang: string): Locale {
  return lang.startsWith('zh') ? 'zh' : 'en';
}

/** The locale's splash page. */
export function homeHref(locale: Locale): string {
  return `${BASE}/${locale}/`;
}

export function docsHref(locale: Locale, slug: string): string {
  return `${BASE}/${locale}/${slug}/`;
}

/**
 * The current page's counterpart in the other locale. `en/` and `zh/` are kept
 * structurally identical, so swapping the locale segment is enough — the same
 * thing Starlight's own language picker does.
 */
export function otherLocaleHref(pathname: string, locale: Locale): string {
  const other: Locale = locale === 'zh' ? 'en' : 'zh';
  return pathname.replace(/\/(?:en|zh)(?=\/|$)/, `/${other}`);
}
