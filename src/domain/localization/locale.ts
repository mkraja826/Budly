export type LocaleTag = string & { readonly __brand: 'LocaleTag' };

export type TextDirection = 'LTR' | 'RTL';

export type LocaleDefinition = Readonly<{
  tag: LocaleTag;
  languageCode: string;
  regionCode?: string;
  direction: TextDirection;
}>;

const RTL_LANGUAGES = new Set(['ar', 'fa', 'he', 'ur']);

export function normalizeLocaleTag(input: string): LocaleTag {
  const trimmed = input.trim().replace(/_/g, '-');
  if (!trimmed) throw new Error('Locale tag cannot be empty.');

  try {
    return Intl.getCanonicalLocales(trimmed)[0] as LocaleTag;
  } catch {
    throw new RangeError(`Invalid locale tag: ${input}`);
  }
}

export function localeDefinition(input: string): LocaleDefinition {
  const tag = normalizeLocaleTag(input);
  const [languageCode, regionCode] = tag.split('-');

  return {
    tag,
    languageCode: languageCode.toLowerCase(),
    regionCode: regionCode?.toUpperCase(),
    direction: RTL_LANGUAGES.has(languageCode.toLowerCase()) ? 'RTL' : 'LTR',
  };
}

/**
 * Returns approved lookup candidates from most specific to least specific.
 * Content publication status must still be enforced by the content service.
 */
export function localeFallbackChain(input: string, approvedGlobalFallback = 'en'): readonly LocaleTag[] {
  const locale = localeDefinition(input);
  const candidates = [locale.tag];

  if (locale.regionCode) {
    candidates.push(normalizeLocaleTag(locale.languageCode));
  }

  const globalFallback = normalizeLocaleTag(approvedGlobalFallback);
  if (!candidates.includes(globalFallback)) candidates.push(globalFallback);

  return candidates;
}
