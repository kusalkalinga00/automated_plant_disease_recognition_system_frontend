"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDiseaseById, updateDisease } from "@/services/admin.services";
import { ApiResponse } from "@/types/common.types";
import { IDiseaseInfo } from "@/types/admin.types";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EditDiseaseViewProps {
  diseaseId: string;
}

const EditDiseaseView: React.FC<EditDiseaseViewProps> = (props) => {
  const { diseaseId } = props;
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const schema = React.useMemo(
    () =>
      z.object({
        display_name: z
          .string()
          .min(1, "Display name is required")
          .min(2, "Display name must be at least 2 characters"),
        description: z
          .string()
          .min(1, "Description is required")
          .min(5, "Description must be at least 5 characters"),
      }),
    []
  );

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: "",
      description: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Fetch disease info
  const { data, isLoading, isFetching } = useQuery<ApiResponse<IDiseaseInfo | null>>({
    queryKey: ["disease", diseaseId],
    queryFn: () => getDiseaseById(session?.accessToken!, diseaseId),
    enabled: !!session?.accessToken && !!diseaseId,
    refetchOnWindowFocus: false,
  });

  const disease = data?.payload ?? null;

  // Reset form when data loads
  React.useEffect(() => {
    if (disease) {
      form.reset({
        display_name: disease.display_name || "",
        description: disease.description || "",
      });
    }
  }, [disease, form]);

  const updateMutation = useMutation({
    mutationKey: ["disease", "update", diseaseId],
    mutationFn: async (values: FormValues) => {
      if (!session?.accessToken) throw new Error("Not authenticated");
      return await updateDisease(session.accessToken, diseaseId, values);
    },
    onSuccess: async (res) => {
      toast.success(res?.message || "Updated successfully");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["disease", diseaseId] }),
        queryClient.invalidateQueries({ queryKey: ["diseases"] }),
      ]);
    },
    onError: (err: any) => {
      toast.error("Update failed", { description: err?.message ?? "Please try again" });
    },
  });

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate(values);
  };

  if (isLoading) {
    return <div className="p-3 text-sm text-muted-foreground">Loading disease...</div>;
  }
  if (!disease) {
    return <div className="p-3 text-sm text-destructive">Failed to load disease.</div>;
  }

  return (
    <div className="space-y-4 p-3">
      <h2 className="text-lg font-semibold tracking-tight">Edit Disease</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl">
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter display name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" rows={6} {...field} />
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

export default EditDiseaseView;
