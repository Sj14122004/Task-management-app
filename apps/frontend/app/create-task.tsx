"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "./header";
import Footer from "./footer";

type User = {
  id: string;
  name: string;
  email: string;
};

type CreateTaskProps = {
  onLogout: () => void;
  onNavigate: (page: string) => void;
};

export default function CreateTask({
  onLogout,
  onNavigate
}: CreateTaskProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
          {
            credentials: "include"
          }
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(
            data.error || "Failed to load users"
          );
          return;
        }

        setUsers(data.users);
      } catch (error) {
        console.error(
          "Failed to fetch users:",
          error
        );
        toast.error("Unable to load users");
      }
    };

    fetchUsers();
  }, []);

  const createTask = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            description: description || null,
            assigned_to: assignedTo || null,
            due_date: dueDate || null
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Failed to create task"
        );
        return;
      }

      toast.success("Task created successfully");

      setTitle("");
      setDescription("");
      setAssignedTo("");
      setDueDate("");

      onNavigate("dashboard");
    } catch (error) {
      console.error("Server error:", error);
      toast.error("Unable to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header
        activePage="create"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">
              Create Task
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create and assign a new task.
            </p>

            <form
              onSubmit={createTask}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Title
                </label>

                <input
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  placeholder="Enter task description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  className="h-32 w-full resize-none rounded-lg border px-3 py-2.5 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Assign To
                </label>

                <select
                  value={assignedTo}
                  onChange={(event) =>
                    setAssignedTo(event.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-black"
                >
                  <option value="">
                    Select user
                  </option>

                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name} - {user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Due Date
                </label>

                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(event.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating..."
                  : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}