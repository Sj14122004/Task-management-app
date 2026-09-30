"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import LogoutConfirm from "./components/LogoutConfirm";

type User = {
  name: string;
  email: string;
};

type HeaderProps = {
  activePage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

export default function Header({
  activePage,
  onNavigate,
  onLogout
}: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] =
    useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
          {
            credentials: "include"
          }
        );

        if (!response.ok) {
          toast.error("Failed to load user information");
          return;
        }

        const data = await response.json();
        setUser(data.current_user);
      } catch (error) {
        console.error("Failed to get user:", error);
        toast.error("Unable to load user information");
      }
    };

    getUser();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Logout failed");
        return;
      }

      setShowLogoutConfirm(false);
      toast.success("Logged out successfully");
      onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Unable to logout");
    }
  };

  const navClass = (page: string) =>
    `rounded-lg px-4 py-2 text-sm font-medium ${
      activePage === page
        ? "bg-black text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <>
      <header className="border-b bg-white">
        <div className="flex w-full items-center justify-between px-8 py-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="text-xl font-bold"
          >
            Task Manager
          </button>

          <nav className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("dashboard")}
              className={navClass("dashboard")}
            >
              Dashboard
            </button>

            <button
              onClick={() => onNavigate("tasks")}
              className={navClass("tasks")}
            >
              All Tasks
            </button>

            <button
              onClick={() => onNavigate("activity")}
              className={navClass("activity")}
            >
              Activity
            </button>

            <button
              onClick={() => onNavigate("create")}
              className={navClass("create")}
            >
              Create Task
            </button>
            <a
              href="https://drive.google.com/file/d/1IqEQj-JN2DWHx7y0cA01a_a46A4BqZK5/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700 animate-pulse"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path
                  d="m10 9 5 3-5 3V9Z"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              Demo Video
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {user && (
              <p className="text-sm font-medium">
                {user.name}
              </p>
            )}

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {showLogoutConfirm && (
        <LogoutConfirm
          onCancel={() => setShowLogoutConfirm(false)}
          onConfirm={logout}
        />
      )}
    </>
  );
}