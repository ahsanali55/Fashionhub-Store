'use client';

import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <main className="bg-background min-h-screen flex items-center justify-center py-12 px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold">Page Not Found</h2>
        <p className="text-muted-foreground">
          Sorry, the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
