"use server";

import { cookies } from "next/headers";
import { Locale, defaultLocale, locales } from "@/i18n/config";

// manage language storing in cookies
const COOKIE_NAME = "NEXT_LOCALE";

function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export async function getUserLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (value && isLocale(value)) return value;
  return defaultLocale;
}

export async function setUserLocale(locale: Locale): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale);
}
