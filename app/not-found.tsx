import Link from 'next/link';
import { FrownIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
      <FrownIcon className="w-24 h-24 text-red-500 mb-6" />
      <h1 className="text-5xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-center mb-8 max-w-md">
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex space-x-4">
        <Link href="/">
          <button className="px-6 py-3 bg-red-900 text-white rounded-lg shadow-md hover:bg-red-800 transition-colors duration-300">
            Go to Homepage
          </button>
        </Link>
        {/* Optionally, add a 'Go Back' button if context is usually available */}
        {/* <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300"
        >
          Go Back
        </button> */}
      </div>
    </div>
  );
}
