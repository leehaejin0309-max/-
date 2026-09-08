import React from 'react';
import { CalculationResult } from '../types';
import { PACKAGING_CONFIGS } from '../utils/calculator';
import { Scale, Box, Layers, Calculator, Info } from 'lucide-react';

interface ResultSummaryProps {
  result: CalculationResult;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-500" />
          <span>오더 계산 결과 요약</span>
        </h2>
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold border border-indigo-100">
          총 {result.items.length}개 품목 혼합 적재
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Total Order Weight */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Box className="w-4 h-4 text-indigo-500" />
            <span>총 오더 중량 (순중량)</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {result.totalOrderWeightKg.toLocaleString()} <span className="text-sm font-normal text-slate-500">KG</span>
          </div>
        </div>

        {/* 2. Total CBM (1000KG당 1.6 CBM) */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Layers className="w-4 h-4 text-sky-500" />
            <span>총 부피 (CBM)</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-slate-800">
              {result.totalCbm.toFixed(2)} <span className="text-sm font-normal text-slate-500">CBM</span>
            </div>
            <span className="text-[11px] text-sky-700">
              * CBM 공식 적용: (총중량 {result.totalGrossWeightKg.toLocaleString()}kg ÷ 1000) × 1.6
            </span>
          </div>
        </div>

        {/* 3. Gross Weight with G1 formula */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Scale className="w-4 h-4 text-emerald-500" />
            <span>포장별 총중량 (G1 공식 반영)</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold text-slate-800">
              {result.totalGrossWeightKg.toLocaleString()} <span className="text-sm font-normal text-slate-500">KG (총중량)</span>
            </div>
            <div className="text-xs text-slate-500">
              G1 포장인 경우: (수량 ÷ 25) × 25.6 공식 적용됨
            </div>
          </div>
        </div>

        {/* 4. Pallet Weight & Final Total Weight */}
        <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>팔레트 포함 최종 총중량</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold text-slate-800">
              {result.totalWeightKg.toLocaleString()} <span className="text-sm font-normal text-slate-500">KG (최종)</span>
            </div>
            <div className="text-xs text-slate-500">
              팔레트 총 {result.totalPallets}개 (+{result.totalPalletWeightKg.toLocaleString()}kg, 개당 10kg)
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Breakdown Table */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-500" />
          <span>품목별 상세 명세</span>
        </h3>
        <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 text-slate-600 border-b border-slate-200">
                <th className="p-3 font-semibold">품목 / 규격</th>
                <th className="p-3 font-semibold">오더 중량</th>
                <th className="p-3 font-semibold">환산 수량</th>
                <th className="p-3 font-semibold">총중량 (G1공식)</th>
                <th className="p-3 font-semibold">팔레트</th>
                <th className="p-3 font-semibold">부피 (CBM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.items.map((it, idx) => {
                const cfg = PACKAGING_CONFIGS[it.packagingType];
                return (
                  <tr key={it.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-800">
                      #{idx + 1} ({it.packagingType}) - {cfg.name}
                    </td>
                    <td className="p-3 text-slate-700 font-medium">{it.orderWeightKg.toLocaleString()} KG</td>
                    <td className="p-3 text-slate-600">약 {it.unitCount.toLocaleString()}개</td>
                    <td className="p-3 text-slate-700 font-semibold">{it.grossWeightKg.toLocaleString()} KG</td>
                    <td className="p-3 text-slate-600">
                      {it.requiredPallets > 0 ? `${it.requiredPallets}개 (+${it.totalPalletWeightKg}kg)` : '미사용'}
                    </td>
                    <td className="p-3 text-slate-700 font-semibold">{it.cbm.toFixed(2)} CBM</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
