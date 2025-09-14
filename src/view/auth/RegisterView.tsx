import RegisterForm from "@/components/register/RegisterForm";
import React from "react";

const RegisterView = () => {
  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <div className="mb-5">
        <h1 className="text-primary text-4xl font-semibold">
          Plant Diseases Detection System
        </h1>
      </div>
      <RegisterForm />
    </div>
  );
};

export default RegisterView;
