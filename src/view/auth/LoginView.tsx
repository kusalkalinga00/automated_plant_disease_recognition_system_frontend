"use client";
import LoginForm from "@/components/login/LoginForm";
import React from "react";
import { Suspense } from "react";

const LoginView = () => {
  return (
    <Suspense>
      <div className="min-h-screen flex justify-center flex-col items-center overflow-hidden">
        <div>
          <h1 className="text-4xl font-bold text-center text-primary mt-10">
            Welcome to Plant Diseases Detection System
          </h1>
        </div>

        <div className="flex flex-col items-center mt-5 w-full max-w-md p-6 rounded-lg ">
          <LoginForm />
        </div>
      </div>
    </Suspense>
  );
};

export default LoginView;
