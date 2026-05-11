import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md text-center">
        <h1 className="mb-4 text-3xl font-bold text-red-600">Access Denied</h1>
        <p className="mb-6 text-gray-600">
          You do not have the required permissions to view this page.
        </p>
        <Link
          href="/"
          className="inline-block rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
