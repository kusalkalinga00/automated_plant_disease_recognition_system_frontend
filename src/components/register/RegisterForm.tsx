"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";
import {
  RegisterUserSchema,
  RegisterUserSchemaType,
} from "@/zod-schemas/register-user.schema";
import { Input } from "@/components/ui/input";
import { register } from "@/services/auth.services";
import { signIn } from "next-auth/react";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<RegisterUserSchemaType>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterUserSchemaType) => {
    setLoading(true);
    try {
      const response = await register(
        data.full_name,
        data.email,
        data.password
      );
      if (!response.success) {
        toast.error(response.message || "Registration failed");
        setLoading(false);
        return;
      }
      toast.success("Registration successful! Logging you in...");
      // Auto-login after registration
      const loginResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      const redirectUrl = searchParams.get("redirect_url") || "/";
      if (loginResult?.ok) {
        router.push(redirectUrl);
      } else {
        toast.error(
          "Registration succeeded, but login failed. Please login manually."
        );
        router.push("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <h2 className="text-2xl font-semibold text-center text-primary">
          Create an account
        </h2>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-descriptionTextColor">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-descriptionTextColor">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-descriptionTextColor">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-descriptionTextColor">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-col flex gap-2 mt-5">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
              </Button>
              <div className="text-center text-sm">or</div>
              <Button
                type="button"
                className="w-full"
                variant={"outline"}
                onClick={() => router.push("/login")}
                disabled={loading}
              >
                Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
