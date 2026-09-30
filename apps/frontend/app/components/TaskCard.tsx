"use client";

import { useState } from "react";
import Button from "./Button";

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
};

type TaskCardProps = {
  task: Task;
  users: User[];
  currentUserId: string;
  onComplete: (taskId: string) => void | Promise<void>;
  onDelete: (taskId: string) => void | Promise<void>;
};

export default function TaskCard({
  task,
  users,
  currentUserId,
  onComplete,
  onDelete
}: TaskCardProps) {
  const [completing, setCompleting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getUserName = () => {
    if (!task.assigned_to) {
      return "Unassigned";
    }

    if (task.assigned_to === currentUserId) {
      return "You";
    }

    const user = users.find(
      (user) => user.id === task.assigned_to
    );

    return user ? user.name : "Unknown user";
  };

  const getStatusClass = () => {
    if (task.status === "COMPLETED") {
      return "bg-green-100 text-green-700";
    }

    if (task.status === "IN_PROGRESS") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  const handleComplete = async () => {
    if (completing || deleting) {
      return;
    }

    setCompleting(true);

    try {
      await onComplete(task.id);
    } catch {
      setCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (deleting || completing) {
      return;
    }

    setDeleting(true);

    try {
      await onDelete(task.id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold">
              {task.title}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass()}`}
            >
              {task.status.replace("_", " ")}
            </span>
          </div>

          {task.description && (
            <p className="mt-3 text-sm text-gray-600">
              {task.description}
            </p>
          )}

          <div className="mt-4 space-y-1">
            <p className="text-sm text-gray-500">
              Assigned to:{" "}
              <span className="font-medium text-gray-700">
                {getUserName()}
              </span>
            </p>

            {task.due_date && (
              <p className="text-sm text-gray-500">
                Due:{" "}
                {new Date(task.due_date).toLocaleString()}
              </p>
            )}

            <p className="text-sm text-gray-400">
              Created:{" "}
              {new Date(task.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {task.status !== "COMPLETED" && !completing && (
            <Button
              variant="success"
              onClick={handleComplete}
            >
              Complete
            </Button>
          )}

          {task.created_by === currentUserId && !deleting && (
            <Button
              variant="secondary"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}