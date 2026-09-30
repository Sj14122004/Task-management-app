"use client";

type Task = {
  id: string;
  status: string;
  due_date: string | null;
};

type TaskStatsProps = {
  tasks: Task[];
};

export default function TaskStats({
  tasks
}: TaskStatsProps) {
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "PENDING"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.due_date || task.status === "COMPLETED") {
      return false;
    }

    return new Date(task.due_date) < new Date();
  }).length;

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      color: "text-gray-900"
    },
    {
      label: "Pending",
      value: pendingTasks,
      color: "text-yellow-600"
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      color: "text-blue-600"
    },
    {
      label: "Completed",
      value: completedTasks,
      color: "text-green-600"
    },
    {
      label: "Overdue",
      value: overdueTasks,
      color: "text-red-600"
    }
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500">
            {stat.label}
          </p>

          <p
            className={`mt-2 text-3xl font-bold ${stat.color}`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}