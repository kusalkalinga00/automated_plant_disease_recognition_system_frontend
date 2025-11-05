"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTreatment, getAvailableLabels } from "@/services/admin.services";
import { ApiResponse } from "@/types/common.types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { locales, type Locale } from "@/i18n/config";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateTreatmentView: React.FC = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const schema = React.useMemo(
    () =>
      z.object({
        disease_label: z.string().min(1, "Disease label is required"),
        title: z
          .string()
          .min(1, "Title is required")
          .min(2, "Title must be at least 2 characters"),
        type: z.string().min(1, "Type is required"),
        dosage: z.string().min(1, "Dosage is required"),
        locale: z
          .string()
          .refine(
            (v) => (locales as readonly string[]).includes(v),
            "Invalid locale"
          ),
        instructions: z
          .string()
          .min(1, "Instructions are required")
          .min(5, "Instructions must be at least 5 characters"),
      }),
    []
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      disease_label: "",
      title: "",
      type: "",
      dosage: "",
      locale: (locales[0] as Locale) ?? "en",
      instructions: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Fetch available labels for Select
  const { data: labelsRes, isLoading: labelsLoading } = useQuery<
    ApiResponse<string[] | null>
  >({
    queryKey: ["disease-labels"],
    queryFn: () => getAvailableLabels(session?.accessToken!),
    enabled: !!session?.accessToken,
    refetchOnWindowFocus: false,
  });

  const labels: string[] = labelsRes?.payload ?? [];

  // Auto-select first label if none selected when labels load
  React.useEffect(() => {
    if (
      !labelsLoading &&
      labels.length > 0 &&
      !form.getValues("disease_label")
    ) {
      form.setValue("disease_label", labels[0], { shouldValidate: true });
    }
  }, [labelsLoading, labels, form]);

  const createMutation = useMutation({
    mutationKey: ["treatment", "create"],
    mutationFn: async (values: FormValues) => {
      if (!session?.accessToken) throw new Error("Not authenticated");
      return await createTreatment(session.accessToken, values);
    },
    onSuccess: async (res) => {
      toast.success(res?.message || "Created successfully");
      await queryClient.invalidateQueries({ queryKey: ["treatments"] });
      form.reset({
        disease_label: labels[0] ?? "",
        title: "",
        type: "",
        dosage: "",
        locale: (locales[0] as Locale) ?? "en",
        instructions: "",
      });
    },
    onError: (err: any) => {
      toast.error("Create failed", {
        description: err?.message ?? "Please try again",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values);
  };

  return (
    <div className="space-y-4 p-3">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          <ArrowLeft className="mr-1.5 size-4" /> Back
        </Button>
        <h2 className="text-lg font-semibold tracking-tight">
          Create Treatment
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="disease_label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disease Label</FormLabel>
                  <Select
                    disabled={labelsLoading}
                    defaultValue={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            labelsLoading ? "Loading labels..." : "Select label"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Labels</SelectLabel>
                        {labels.map((label) => (
                          <SelectItem key={label} value={label}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locale</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(v) => field.onChange(v)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select locale" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Locales</SelectLabel>
                        {locales.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 5 ml twice daily" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter instructions"
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateTreatmentView;
