"use server";

import { cookies } from "next/headers";
import { Locale, defaultLocale } from "@/i18n/config";

// manage language storing in cookies
const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  return (await cookies().get(COOKIE_NAME)?.value) || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  cookies().set(COOKIE_NAME, locale);
}
