
import React from 'react';
import { Loader2, MapPin, Search, Database, CheckCircle2 } from 'lucide-react';

interface LoadingBarProps {
  progress: number;
  status: string;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ progress, status }) => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm animate-fadeIn">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2">
           {progress < 100 ? (
             <Loader2 className="w-5 h-5 text-nexus-royal animate-spin" />
           ) : (
             <CheckCircle2 className="w-5 h-5 text-emerald-500" />
           )}
           <span className="text-sm font-bold text-nexus-dark">{status}</span>
        </div>
        <span className="text-xs font-bold text-nexus-slate">{Math.round(progress)}%</span>
      </div>
      
      {/* Progress Track */}
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
            className="h-full bg-nexus-royal transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
        >
            <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite] skew-x-12"></div>
        </div>
      </div>

      {/* Steps Visualization */}
      <div className="flex justify-between mt-4 px-1">
          <div className={`flex flex-col items-center gap-1 transition-colors ${progress > 10 ? 'text-nexus-royal' : 'text-gray-300'}`}>
              <MapPin className="w-4 h-4" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Maps</span>
          </div>
          <div className="h-px bg-gray-100 flex-1 mx-2 self-center"></div>
          <div className={`flex flex-col items-center gap-1 transition-colors ${progress > 40 ? 'text-nexus-royal' : 'text-gray-300'}`}>
              <Search className="w-4 h-4" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Dados</span>
          </div>
          <div className="h-px bg-gray-100 flex-1 mx-2 self-center"></div>
           <div className={`flex flex-col items-center gap-1 transition-colors ${progress > 75 ? 'text-nexus-royal' : 'text-gray-300'}`}>
              <Database className="w-4 h-4" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Enriquecimento</span>
          </div>
      </div>
    </div>
  );
};

export default LoadingBar;
