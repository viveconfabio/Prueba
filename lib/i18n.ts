export type Locale = "en" | "es"

const dictionaries: Record<Locale, () => Promise<any>> = {
  en: () => import("@/locales/en.json").then((m) => m.default),
  es: () => import("@/locales/es.json").then((m) => m.default),
}

export async function getDictionary(locale: Locale) {
  const loader = dictionaries[locale] ?? dictionaries.en
  return loader()
}
