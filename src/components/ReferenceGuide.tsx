import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Package, Layers, Ship, Scale } from 'lucide-react';
import { PACKAGING_CONFIGS } from '../utils/calculator';

export const ReferenceGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const packagingList = [
    { code: 'G0', weight: '20 KG', perPallet: '40 BAG', palletWeight: '15 KG' },
    { code: 'G1', weight: '25 KG', perPallet: '40 BAG', palletWeight: '15 KG' },
    { code: 'F1', weight: '500 KG', perPallet: '2 BAG', palletWeight: '10 KG' },
    { code: 'F2', weight: '600 KG', perPallet: '2 BAG', palletWeight: '10 KG' },
    { code: 'F4', weight: '750 KG', perPallet: '2 BAG', palletWeight: '10 KG' },
    { code: 'F5', weight: '800 KG', perPallet: '2 BAG', palletWeight: '10 KG' },
    { code: 'C3L', weight: '650 KG', perPallet: '1 BAG', palletWeight: '10 KG' },
  ];

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
            <h3 className="font-bold text-slate-800 text-base">포장단위 규격 및 계산 기준 안내</h3>
            <p className="text-xs text-slate-500">포장단위별 중량, 팔렛트 적재수량, CBM 계산식(순중량 기준)</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 gap-6 text-xs text-slate-600 animate-fadeIn">
          {/* Packaging Table */}
          <div className="flex flex-col gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Package className="w-4 h-4 text-indigo-500" />
              <span>포장단위 규격 정보</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-200/60 text-slate-700 border-b border-slate-300">
                    <th className="p-2.5 font-semibold">포장단위(BAG)</th>
                    <th className="p-2.5 font-semibold">중량/BAG</th>
                    <th className="p-2.5 font-semibold">팔렛트당 적재수량</th>
                    <th className="p-2.5 font-semibold">팔렛트 무게/PALLET</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  {packagingList.map((p) => (
                    <tr key={p.code} className="hover:bg-white/60">
                      <td className="p-2.5 font-bold text-slate-800">{p.code}</td>
                      <td className="p-2.5">{p.weight}</td>
                      <td className="p-2.5">{p.perPallet}</td>
                      <td className="p-2.5">{p.palletWeight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rules & CBM Formula */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span>CBM 계산 공식</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                • <strong>CBM = (순중량 KG ÷ 1000) × 1.6</strong><br />
                • 오더 순중량을 기준으로 부피(CBM)가 산출됩니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Ship className="w-4 h-4 text-sky-500" />
                <span>컨테이너 제원</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                • <strong>20ft 컨테이너</strong>: 최대 중량 21,600 KG / 28 CBM<br />
                • <strong>40ft 컨테이너</strong>: 최대 중량 26,500 KG / 58 CBM
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
