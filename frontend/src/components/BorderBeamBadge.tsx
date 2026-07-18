import React from 'react';

interface BorderBeamBadgeProps {
  text?: string;
  icon?: React.ReactNode;
}

const BorderBeamBadge: React.FC<BorderBeamBadgeProps> = ({
  text = "Platform Kolaborasi Tim",
  icon,
}) => {
  return (
    <div className="relative inline-flex rounded-full p-[1.5px] overflow-hidden">
      {/* Layer beam — dibuat jauh lebih besar dari badge supaya conic-gradient tetap bulat sempurna saat diputar */}
      <div
        className="absolute inset-[-1000%]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0%, #0D9488 10%, #5EEAD4 15%, #14B8A6 20%, transparent 30%, transparent 100%)",
          animation: "spin 3.5s linear infinite",
        }}
      />

      {/* Isi badge */}
      <div className="relative z-10 rounded-full bg-slate-800/90 border border-slate-700/40 px-4 py-1.5 text-sm text-teal-300 font-medium inline-flex items-center gap-1.5 backdrop-blur-sm">
        {icon}
        {text}
      </div>
    </div>
  );
};

export default BorderBeamBadge;
