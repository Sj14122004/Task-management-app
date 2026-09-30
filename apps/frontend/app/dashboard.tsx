"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "./header";
import Footer from "./footer";
import Button from "./components/Button";
import TaskStats from "./components/TaskStats";
import UpcomingTasks from "./components/UpcomingTasks";

type User = {
  id: string;
  name: string;
  email: string;
};

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_by: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
};

type DashboardProps = {
  onLogout: () => void;
  onNavigate: (page: string) => void;
};

export default function Dashboard({
  onLogout,
  onNavigate
}: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
        {
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Failed to load tasks");
        return;
      }

      setTasks(data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Unable to load tasks");
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [tasksResponse, usersResponse] =
          await Promise.all([
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
              {
                credentials: "include"
              }
            ),
            fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
              {
                credentials: "include"
              }
            )
          ]);

        const tasksData = await tasksResponse.json();
        const usersData = await usersResponse.json();

        if (!tasksResponse.ok) {
          toast.error(
            tasksData.error || "Failed to load tasks"
          );
        } else {
          setTasks(tasksData.tasks);
        }

        if (!usersResponse.ok) {
          toast.error(
            usersData.error || "Failed to load users"
          );
        } else {
          setUsers(usersData.users);

          if (usersData.current_user) {
            setCurrentUserId(
              usersData.current_user.id
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );
        toast.error("Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const completeTask = async (taskId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: "COMPLETED"
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Failed to complete task"
        );
        return;
      }

      toast.success("Task completed successfully");
      await fetchTasks();
    } catch (error) {
      console.error(
        "Failed to complete task:",
        error
      );
      toast.error("Unable to complete task");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Failed to delete task"
        );
        return;
      }

      toast.success("Task deleted successfully");
      await fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Unable to delete task");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header
        activePage="dashboard"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Dashboard
              </h1>

              <p className="mt-2 text-gray-500">
                View your upcoming tasks and task statistics.
              </p>
            </div>
          </div>

          <TaskStats tasks={tasks} />

          <UpcomingTasks
            tasks={tasks}
            users={users}
            currentUserId={currentUserId}
            onComplete={completeTask}
            onDelete={deleteTask}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}