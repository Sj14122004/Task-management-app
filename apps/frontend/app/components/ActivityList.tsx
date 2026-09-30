"use client";

type Activity = {
  id: string;
  user_id: string;
  action: string;
  message: string;
  created_at: string;
};

type ActivityListProps = {
  activities: Activity[];
};

export default function ActivityList({
  activities
}: ActivityListProps) {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleString();
  };

  if (activities.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <h3 className="text-lg font-semibold">
          No activity yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Activity will appear here when tasks are created,
          completed, or deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="border-b px-6 py-5 last:border-b-0"
        >
          <p className="text-sm font-medium text-gray-800">
            {activity.message}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {formatTime(activity.created_at)}
          </p>
        </div>
      ))}
    </div>
  );
}