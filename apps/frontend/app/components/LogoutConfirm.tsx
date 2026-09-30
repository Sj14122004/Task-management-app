"use client";

type LogoutConfirmProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function LogoutConfirm({
  onConfirm,
  onCancel
}: LogoutConfirmProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">
          Logout
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to logout?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}