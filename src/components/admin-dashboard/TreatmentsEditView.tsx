"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTreatmentById, updateTreatment } from "@/services/admin.services";
import { ApiResponse } from "@/types/common.types";
import { ITreatmentInfo } from "@/types/admin.types";
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

interface TreatmentsEditViewProps {
  treatmentId: string;
}

const TreatmentsEditView: React.FC<TreatmentsEditViewProps> = ({ treatmentId }) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const schema = React.useMemo(
    () =>
      z.object({
        title: z
          .string()
          .min(1, "Title is required")
          .min(2, "Title must be at least 2 characters"),
        type: z.string().min(1, "Type is required"),
        dosage: z.string().min(1, "Dosage is required"),
        locale: z
          .string()
          .refine((v) => (locales as readonly string[]).includes(v), "Invalid locale"),
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
      title: "",
      type: "",
      dosage: "",
      locale: (locales[0] as Locale) ?? "en",
      instructions: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Fetch treatment
  const { data, isLoading } = useQuery<ApiResponse<ITreatmentInfo | null>>({
    queryKey: ["treatment", treatmentId],
    queryFn: () => getTreatmentById(session?.accessToken!, treatmentId),
    enabled: !!session?.accessToken && !!treatmentId,
    refetchOnWindowFocus: false,
  });

  const treatment = data?.payload ?? null;

  // Populate form when data arrives
  React.useEffect(() => {
    if (treatment) {
      form.reset({
        title: treatment.title || "",
        type: treatment.type || "",
        dosage: treatment.dosage || "",
        locale: (treatment.locale as string) || (locales[0] as string),
        instructions: treatment.instructions || "",
      });
    }
  }, [treatment, form]);

  const updateMutation = useMutation({
    mutationKey: ["treatment", "update", treatmentId],
    mutationFn: async (values: FormValues) => {
      if (!session?.accessToken) throw new Error("Not authenticated");
      return await updateTreatment(session.accessToken, treatmentId, values);
    },
    onSuccess: async (res) => {
      toast.success(res?.message || "Updated successfully");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["treatment", treatmentId] }),
        queryClient.invalidateQueries({ queryKey: ["treatments"] }),
      ]);
    },
    onError: (err: any) => {
      toast.error("Update failed", {
        description: err?.message ?? "Please try again",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return <div className="p-3 text-sm text-muted-foreground">Loading treatment...</div>;
  }
  if (!treatment) {
    return <div className="p-3 text-sm text-destructive">Failed to load treatment.</div>;
  }

  return (
    <div className="space-y-4 p-3">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="mr-1.5 size-4" /> Back
        </Button>
        <h2 className="text-lg font-semibold tracking-tight">Edit Treatment</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter instructions" rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TreatmentsEditView;
