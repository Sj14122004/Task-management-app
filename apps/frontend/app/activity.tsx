"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "./header";
import Footer from "./footer";
import ActivityList from "./components/ActivityList";

type Activity = {
  id: string;
  user_id: string;
  action: string;
  message: string;
  created_at: string;
};

type ActivityPageProps = {
  onLogout: () => void;
  onNavigate: (page: string) => void;
};

export default function ActivityPage({
  onLogout,
  onNavigate
}: ActivityPageProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/activities`,
          {
            credentials: "include"
          }
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(
            data.error || "Failed to load activities"
          );
          return;
        }

        setActivities(data.activities);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        toast.error("Unable to load activities");
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const clearActivities = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/activities`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          data.error || "Failed to clear activities"
        );
        return;
      }

      setActivities([]);
      toast.success("All activity cleared");
    } catch (error) {
      console.error("Failed to clear activities:", error);
      toast.error("Unable to clear activities");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading activity...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header
        activePage="activity"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-1 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Activity
              </h1>
              <p className="mt-2 text-gray-500">
                View your team&apos;s recent activity.
              </p>
            </div>

            {activities.length > 0 && (
              <button
                onClick={clearActivities}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Clear All
              </button>
            )}
          </div>

          <ActivityList activities={activities} />
        </div>
      </main>

      <Footer />
    </div>
  );
}