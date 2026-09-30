"use client";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

type LoginProps = {
  onLogin: () => void;
};

export default function Login({ onLogin }: LoginProps) {
  const handleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            credential: credentialResponse.credential
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      toast.success("Login successful");
      onLogin();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Unable to connect to server");
    }
  };

  const handleError = () => {
    toast.error("Google login failed");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-2 text-3xl font-bold">
          Task Management App
        </h1>

        <p className="mb-8 text-gray-500">
          Sign in to manage your tasks
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap={false}
            use_fedcm_for_button={true}
          />
        </div>
      </div>
    </div>
  );
}