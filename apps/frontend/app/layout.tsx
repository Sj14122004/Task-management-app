"use client";

import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import "./globals.css";

const clientId =
  "404640716955-c97hg3gvlodl2on4u3m80dhmhgfhvd7r.apps.googleusercontent.com";

  
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.title = "Task Manager";
  }, []);

  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={clientId}>
          {children}

          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}