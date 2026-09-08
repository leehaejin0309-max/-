import React from 'react';
import { PackageCheck, Ship, Scale, Layers } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-200 to-sky-200 flex items-center justify-center text-indigo-700 shadow-xs">
            <Ship className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              컨테이너 적재 계산기
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              20ft / 40ft 컨테이너 오더 수량, 중량, CBM 및 팔레트 적재 시뮬레이터
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-indigo-50/60 px-3 py-1.5 rounded-full border border-indigo-100">
          <PackageCheck className="w-4 h-4 text-indigo-500" />
          <span>G1, F1, F4, F5 규격 자동 계산 지원</span>
        </div>
      </div>
    </header>
  );
};
