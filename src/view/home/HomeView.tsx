"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf, Sparkles, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

const HomeView = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const t = useTranslations("home");

  const primaryLabel = session?.user ? t("upload_and_scan") : "Sign in to scan";
  const primaryHref = session?.user ? "/scan" : "/login";

  const onPrimaryClick = () => {
    router.push(primaryHref);
  };

  return (
    <main className="relative overflow-hidden">
      {/* Background: soft green gradient + subtle radial glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_10%_10%,theme(colors.primary/10),transparent_60%),radial-gradient(70%_50%_at_90%_10%,theme(colors.primary/8),transparent_60%)]" />
        <div className="absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        {/* Faint leaf illustration */}
        <Leaf className="absolute right-6 top-6 size-40 text-primary/10" />
      </div>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 pb-16 pt-20 text-center sm:gap-8 sm:pb-24 sm:pt-24">
        <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
          AI-powered plant health assistant
        </span>
        <h1 className="font-serif text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Button onClick={onPrimaryClick} size="lg" className="min-w-44">
            {session?.user ? <Upload className="mr-1.5" /> : null}
            {primaryLabel}
          </Button>
          <Button asChild variant="ghost" size="lg">
            <a href="#how" className="">
              How it works
            </a>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
            {t("how_its_works")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t("three_simple_steps_from_photo_to_treatment")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Upload className="size-5" />
                </div>
                <CardTitle className="text-base">
                  {t("upload_a_leaf_photo")}
                </CardTitle>
              </div>
              <CardDescription>{t("card1_sentence_1")}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("card1_sentence_2")}
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <CardTitle className="text-base">{t("card2_title")}</CardTitle>
              </div>
              <CardDescription>{t("card2_sentence_1")}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("card2_sentence_2")}
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Leaf className="size-5" />
                </div>
                <CardTitle className="text-base">{t("card3_title")}</CardTitle>
              </div>
              <CardDescription>{t("card3_sentence_1")}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("card3_sentence_2")}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default HomeView;
