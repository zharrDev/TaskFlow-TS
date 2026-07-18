import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineLockClosed } from 'react-icons/hi2';

const Error401Page: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-red-100 dark:bg-red-900/20 mb-8">
          <HiOutlineLockClosed className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-6xl font-extrabold text-primary-600 dark:text-primary-400 mb-4">401</h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Unauthorized</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          You need to be logged in to access this page. Please sign in to continue.
        </p>
        <Link to="/login" className="btn-primary inline-flex items-center gap-2">
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Error401Page;
