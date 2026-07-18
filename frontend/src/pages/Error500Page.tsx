import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

const Error500Page: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-red-100 dark:bg-red-900/20 mb-8">
          <HiOutlineExclamationTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-6xl font-extrabold text-primary-600 dark:text-primary-400 mb-4">500</h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Internal Server Error</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          Something went wrong on our end. Please try again later or contact support.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
            Back to Dashboard
          </Link>
          <button onClick={() => window.location.reload()} className="btn-secondary inline-flex items-center gap-2">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error500Page;
