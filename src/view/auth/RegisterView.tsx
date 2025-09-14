import RegisterForm from "@/components/register/RegisterForm";
import React from "react";

const RegisterView = () => {
  return (
    <div className="flex  items-center min-h-screen flex-col">
      <div className="mt-5">
        <h1 className="text-primary text-4xl font-semibold">
          Plant Diseases Detection System
        </h1>
      </div>
      <div className="flex flex-col items-center mt-8 w-full max-w-md p-6 rounded-lg ">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterView;
