import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#242c34] bg-[#14181c] text-[#678] text-xs py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Brand mark & copyright */}
        <div className="flex items-center gap-2">
          <div className="flex items-center -space-x-1" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff4500] inline-block opacity-90" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e054] inline-block opacity-95" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#40bcf4] inline-block opacity-90" />
          </div>
          <span className="font-display font-semibold text-white tracking-tight">otakuboxd</span>
          <span>·</span>
          <span className="font-mono text-[11px]">The social network for anime lovers</span>
        </div>

        {/* Quiet links & disclaimer */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
          <span>Film data via Jikan & MyAnimeList</span>
          <span aria-hidden="true">·</span>
          <span>Crafted for anime cinephiles</span>
        </div>

      </div>
    </footer>
  );
};
