"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDisease } from "@/services/admin.services";
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
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateDiseasesView: React.FC = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();

  const schema = React.useMemo(
    () =>
      z.object({
        label: z
          .string()
          .min(1, "Label is required")
          .regex(
            /^[a-z0-9_\-]+$/i,
            "Only letters, numbers, dashes and underscores are allowed"
          )
          .min(2, "Label must be at least 2 characters"),
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
      label: "",
      display_name: "",
      description: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const mutation = useMutation({
    mutationKey: ["disease", "create"],
    mutationFn: async (values: FormValues) => {
      if (!session?.accessToken) throw new Error("Not authenticated");
      return await createDisease(session.accessToken, values);
    },
    onSuccess: async (res) => {
      toast.success(res?.message || "Disease created");
      form.reset();
      await queryClient.invalidateQueries({ queryKey: ["diseases"] });
    },
    onError: (err: any) => {
      toast.error("Create failed", {
        description: err?.message ?? "Please try again",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
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
        <h2 className="text-lg font-semibold tracking-tight">Create Disease</h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-2xl"
        >
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter unique label (e.g. leaf_blight)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <Textarea
                    placeholder="Enter description"
                    rows={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                "Creating..."
              ) : (
                <span className="inline-flex items-center">
                  <Plus className="mr-1.5 size-4" /> Create
                </span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateDiseasesView;
