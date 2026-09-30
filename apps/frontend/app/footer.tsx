export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-8 py-4 text-sm text-gray-500">
        <span>&copy; 2026 Task Manager. All rights reserved.</span>
        <a
            href="https://drive.google.com/file/d/1IqEQj-JN2DWHx7y0cA01a_a46A4BqZK5/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700 animate-pulse"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path
                d="m10 9 5 3-5 3V9Z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            Demo Video
        </a>
      </div>
    </footer>
  );
}