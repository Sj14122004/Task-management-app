"use client";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "success" | "secondary";
};

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary"
}: ButtonProps) {
  const styles = {
    primary: "bg-black text-white hover:bg-gray-800",
    success: "bg-green-600 text-white hover:bg-green-700",
    secondary:
      "border text-gray-700 hover:bg-gray-100"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${styles[variant]} disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );
}