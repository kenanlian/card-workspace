// Obsidian on a Chinese system sorts names by pinyin: a bare `localeCompare`
// uses the OS locale. Headless Chrome defaults to en-US (Han by code point), so
// an episode about name order imports this first to sort the way its viewers'
// Obsidian does. Calls that name a locale or options are left alone.
const collator = new Intl.Collator("zh-CN");
const original = String.prototype.localeCompare;

String.prototype.localeCompare = function localeCompare(this: string, that: string, locales?: string | string[], options?: Intl.CollatorOptions): number {
  return locales === undefined && options === undefined
    ? collator.compare(String(this), String(that))
    : original.call(this, that, locales, options);
};

export {};
