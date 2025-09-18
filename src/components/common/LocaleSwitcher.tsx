"use client";

import React, { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";
import { Loader2 } from "lucide-react";

const LocaleSwitcher: React.FC = () => {
  const t = useTranslations("Languages");
  const locale = useLocale();

  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }
  return (
    <div>
      <Select defaultValue={locale} onValueChange={onChange}>
        <SelectTrigger
          className={`border-0 focus-visible:ring-transparent outline-none flex flex-row justify-center items-center gap-1 ${
            isPending && "pointer-events-none hidden"
          } `}
        >
          <SelectValue placeholder={t("place_holder")} />
        </SelectTrigger>
        {isPending && <Loader2 className="size-4 animate-spin" />}
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="font-extrabold">{t("title")}</SelectLabel>
            <SelectItem value="en" className="font-normal">
              {t("english")}
            </SelectItem>
            <SelectItem value="ta" className="font-normal">
              {t("tamil")}
            </SelectItem>
            <SelectItem value="sh" className="font-normal">
              {t("sinhala")}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocaleSwitcher;
