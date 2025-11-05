export type Locale = (typeof locales)[number];

export const locales = ["en", "ta", "si"] as const;
export const defaultLocale: Locale = "en";
