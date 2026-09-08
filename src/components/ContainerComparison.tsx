import React from 'react';
import { CalculationResult } from '../types';
import { CONTAINER_SPECS } from '../utils/calculator';
import { Ship, CheckCircle2, AlertTriangle, Scale, Layers } from 'lucide-react';

interface ContainerComparisonProps {
  result: CalculationResult;
}

export const ContainerComparison: React.FC<ContainerComparisonProps> = ({ result }) => {
  const renderContainerCard = (
    type: '20ft' | '40ft',
    data: CalculationResult['container20ft'] | CalculationResult['container40ft']
  ) => {
    const spec = CONTAINER_SPECS[type];
    const isOk = data.canFit;

    return (
      <div
        key={type}
        className={`rounded-3xl p-6 border transition-all flex flex-col justify-between gap-5 relative overflow-hidden ${
          isOk
            ? 'bg-gradient-to-br from-emerald-50/40 via-white to-sky-50/30 border-emerald-200 shadow-sm'
            : 'bg-gradient-to-br from-rose-50/40 via-white to-amber-50/30 border-rose-200 shadow-sm'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
                isOk ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              <Ship className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">{spec.name}</h3>
              <p className="text-xs text-slate-500">
                허용 한도: 중량 {spec.maxWeightKg.toLocaleString()}kg / 부피 {spec.maxCbm} CBM
              </p>
            </div>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
              isOk
                ? 'bg-emerald-100/80 text-emerald-800 border-emerald-300'
                : 'bg-rose-100/80 text-rose-800 border-rose-300'
            }`}
          >
            {isOk ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>적재 가능</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>적재 초과</span>
              </>
            )}
          </div>
        </div>

        {/* Utilization Bars */}
        <div className="flex flex-col gap-3.5 bg-white/70 rounded-2xl p-4 border border-slate-100">
          {/* Weight Utilization */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-emerald-500" />
                <span>중량 활용률 ({result.totalWeightKg.toLocaleString()} / {spec.maxWeightKg.toLocaleString()} KG)</span>
              </span>
              <span className={`font-bold ${data.weightStatus === 'OK' ? 'text-slate-700' : 'text-rose-600'}`}>
                {data.utilizationWeight}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  data.weightStatus === 'OK' ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, data.utilizationWeight)}%` }}
              />
            </div>
          </div>

          {/* Volume Utilization */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-600 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-sky-500" />
                <span>부피 활용률 ({result.totalCbm.toFixed(1)} / {spec.maxCbm} CBM)</span>
              </span>
              <span className={`font-bold ${data.volumeStatus === 'OK' ? 'text-slate-700' : 'text-rose-600'}`}>
                {data.utilizationVolume}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  data.volumeStatus === 'OK' ? 'bg-sky-400' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, data.utilizationVolume)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Max Loadable Weight info */}
        <div className="flex items-center justify-between text-xs bg-slate-50/80 px-4 py-3 rounded-2xl border border-slate-100">
          <span className="text-slate-600">해당 컨테이너 최대 적재 가능 오더 중량:</span>
          <span className="font-bold text-indigo-700 text-sm">
            최대 {data.maxLoadableWeightKg.toLocaleString()} KG
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Ship className="w-5 h-5 text-indigo-500" />
          <span>컨테이너 적재 가능 여부 비교 (20ft vs 40ft)</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderContainerCard('20ft', result.container20ft)}
        {renderContainerCard('40ft', result.container40ft)}
      </div>
    </div>
  );
};
