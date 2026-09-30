"use client";

import { useState } from "react";
import TaskCard from "./TaskCard";

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
  completed_at?: string | null;
};

type AllTasksProps = {
  tasks: Task[];
  users: User[];
  currentUserId: string;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
};

export default function AllTasks({
  tasks,
  users,
  currentUserId,
  onComplete,
  onDelete
}: AllTasksProps) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    if (!matchesSearch) {
      return false;
    }

    if (filter === "ALL") {
      return true;
    }

    if (filter === "OVERDUE") {
      if (!task.due_date || task.status === "COMPLETED") {
        return false;
      }

      return new Date(task.due_date) < new Date();
    }

    return task.status === filter;
  });

  const filters = [
    { label: "All Tasks", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Overdue", value: "OVERDUE" }
  ];

  return (
    <section>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">
            All Tasks
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View and filter your tasks.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:border-black sm:w-64"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === item.value
                ? "bg-black text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <h3 className="text-lg font-semibold">
            No tasks found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Try changing the filter or search.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              currentUserId={currentUserId}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}