import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800">Welcome to ArshivLegal CMS</h1>
        <p className="text-gray-600">Manage blogs, videos, and uploads from one place.</p>
        <Link
          href="/dashboard"
          className="inline-block bg-primary-main text-white px-6 py-3 rounded-lg hover:bg-primary-light transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
