"use client";

import { useEffect, useState } from "react";
import Login from "./login";
import Dashboard from "./dashboard";
import CreateTask from "./create-task";
import AllTasksPage from "./all-tasks";
import ActivityPage from "./activity";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            credentials: "include"
          }
        );

        if (response.ok) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      document.title = "Task Manager | Login";
      return;
    }

    if (activePage === "dashboard") {
      document.title = "Task Manager | Dashboard";
    }

    if (activePage === "tasks") {
      document.title = "Task Manager | All Tasks";
    }

    if (activePage === "activity") {
      document.title = "Task Manager | Activity";
    }

    if (activePage === "create") {
      document.title = "Task Manager | Create Task";
    }
  }, [loggedIn, activePage]);

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <Login
        onLogin={() => {
          setLoggedIn(true);
          setActivePage("dashboard");
        }}
      />
    );
  }

  if (activePage === "tasks") {
    return (
      <AllTasksPage
        onLogout={() => setLoggedIn(false)}
        onNavigate={setActivePage}
      />
    );
  }

  if (activePage === "activity") {
    return (
      <ActivityPage
        onLogout={() => setLoggedIn(false)}
        onNavigate={setActivePage}
      />
    );
  }

  if (activePage === "create") {
    return (
      <CreateTask
        onLogout={() => setLoggedIn(false)}
        onNavigate={setActivePage}
      />
    );
  }

  return (
    <Dashboard
      onLogout={() => setLoggedIn(false)}
      onNavigate={setActivePage}
    />
  );
}