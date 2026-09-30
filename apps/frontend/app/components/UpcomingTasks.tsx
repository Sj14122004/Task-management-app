"use client";

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

type UpcomingTasksProps = {
  tasks: Task[];
  users: User[];
  currentUserId: string;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
};

export default function UpcomingTasks({
  tasks,
  users,
  currentUserId,
  onComplete,
  onDelete
}: UpcomingTasksProps) {
  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.due_date &&
        task.status !== "COMPLETED"
    )
    .sort(
      (a, b) =>
        new Date(a.due_date!).getTime() -
        new Date(b.due_date!).getTime()
    )
    .slice(0, 3);

  return (
    <section className="mb-10">
      <div className="mb-5">
        <h2 className="text-xl font-bold">
          Upcoming Tasks
        </h2>
      </div>

      {upcomingTasks.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <h3 className="font-semibold">
            No upcoming tasks
          </h3>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingTasks.map((task) => (
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