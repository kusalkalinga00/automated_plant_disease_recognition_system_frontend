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
  const t = useTranslations("HomePage");

  const primaryLabel = session?.user ? "Upload & scan" : "Sign in to scan";
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
          Upload a leaf photo. Get instant diagnosis, description, and
          solutions.
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

        {/* Hero visual */}
        {/* <div className="mt-8 w-full max-w-4xl rounded-xl border bg-card/60 p-3 shadow-md sm:mt-12">
          <div className="grid grid-cols-3 items-center gap-3 sm:gap-4">
            <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
            <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
            <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          </div>
        </div> */}
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
            How it works
          </h2>
          <p className="mt-2 text-muted-foreground">
            Three simple steps from photo to treatment.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Upload className="size-5" />
                </div>
                <CardTitle className="text-base">Upload a leaf photo</CardTitle>
              </div>
              <CardDescription>
                Use a clear photo in good light. We support JPG, PNG, and HEIC.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Drag and drop or select from your device. We handle EXIF safely.
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <CardTitle className="text-base">Get diagnosis</CardTitle>
              </div>
              <CardDescription>
                Model predicts disease label with confidence in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              See a friendly summary, confidence score, and what it means.
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Leaf className="size-5" />
                </div>
                <CardTitle className="text-base">
                  Treat with recommendations
                </CardTitle>
              </div>
              <CardDescription>
                Get steps to mitigate and manage the disease effectively.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Practical tips, products, and prevention guidance tailored to the
              crop.
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default HomeView;
