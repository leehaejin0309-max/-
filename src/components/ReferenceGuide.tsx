import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Package, Layers, Ship, Scale } from 'lucide-react';

export const ReferenceGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 transition-all">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">계산 기준 및 가이드 안내</h3>
            <p className="text-xs text-slate-500">포장단위, CBM 계산식(1000KG당 1.6), 팔레트 및 컨테이너 제원</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 animate-fadeIn">
          {/* 1. Packaging Units */}
          <div className="flex flex-col gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Package className="w-4 h-4 text-indigo-500" />
              <span>포장단위 및 총중량 공식</span>
            </h4>
            <ul className="flex flex-col gap-2">
              <li className="flex justify-between items-center py-1 border-b border-slate-200/50">
                <span className="font-semibold text-slate-700">G1 (25KG 지대)</span>
                <span>총중량 = (오더중량 ÷ 25) × 25.6</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-200/50">
                <span className="font-semibold text-slate-700">F1 (500KG 빅백)</span>
                <span>오더중량 = 총중량 (동일)</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-200/50">
                <span className="font-semibold text-slate-700">F4 (750KG 빅백)</span>
                <span>오더중량 = 총중량 (동일)</span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span className="font-semibold text-slate-700">F5 (800KG 빅백)</span>
                <span>오더중량 = 총중량 (동일)</span>
              </li>
            </ul>
          </div>

          {/* 2. Pallet & CBM Rule */}
          <div className="flex flex-col gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>팔레트 및 CBM 계산 규칙</span>
            </h4>
            <ul className="flex flex-col gap-2">
              <li className="flex justify-between items-center py-1 border-b border-slate-200/50">
                <span className="font-semibold text-slate-700">팔레트 중량</span>
                <span>개당 10 KG 추가</span>
              </li>
              <li className="flex justify-between items-center py-1 border-b border-slate-200/50">
                <span className="font-semibold text-slate-700">팔레트 적재 수량</span>
                <span>G1: 팔레트당 40개 / F계열: 팔레트당 2개</span>
              </li>
              <li className="flex justify-between items-center py-1">
                <span className="font-semibold text-slate-700">CBM 계산 공식</span>
                <span className="font-bold text-sky-700">1,000 KG 당 × 1.6 CBM</span>
              </li>
            </ul>
          </div>

          {/* 3. Container Specs */}
          <div className="flex flex-col gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 md:col-span-2">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Ship className="w-4 h-4 text-sky-500" />
              <span>컨테이너 제원 (20피트 / 40피트) 및 혼합 적재</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                <div className="font-bold text-slate-800 mb-1">20피트 컨테이너 (20ft Dry)</div>
                <div className="text-slate-500 flex flex-col gap-1">
                  <span>• 최대 적재 중량: 21,600 KG</span>
                  <span>• 실용 적재 부피: 28 CBM</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200/60">
                <div className="font-bold text-slate-800 mb-1">40피트 컨테이너 (40ft Dry)</div>
                <div className="text-slate-500 flex flex-col gap-1">
                  <span>• 최대 적재 중량: 26,500 KG</span>
                  <span>• 실용 적재 부피: 58 CBM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
