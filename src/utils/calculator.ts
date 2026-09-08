import { PackagingInfo, PackagingType, OrderItem, CalculationResult, ItemCalculationResult } from '../types';

export const PACKAGING_CONFIGS: Record<PackagingType, PackagingInfo> = {
  G1: {
    code: 'G1',
    name: 'G1 포장 (25KG 지대/백)',
    unitWeightKg: 25,
    itemsPerPallet: 40,
    palletWeightKg: 10,
    palletDimensions: { lengthMm: 1300, widthMm: 1100, heightMm: 1400 },
  },
  F1: {
    code: 'F1',
    name: 'F1 포장 (500KG 빅백/톤백)',
    unitWeightKg: 500,
    itemsPerPallet: 2,
    palletWeightKg: 10,
    palletDimensions: { lengthMm: 1100, widthMm: 1100, heightMm: 2200 },
  },
  F4: {
    code: 'F4',
    name: 'F4 포장 (750KG 빅백/톤백)',
    unitWeightKg: 750,
    itemsPerPallet: 2,
    palletWeightKg: 10,
    palletDimensions: { lengthMm: 1100, widthMm: 1100, heightMm: 2200 },
  },
  F5: {
    code: 'F5',
    name: 'F5 포장 (800KG 빅백/톤백)',
    unitWeightKg: 800,
    itemsPerPallet: 2,
    palletWeightKg: 10,
    palletDimensions: { lengthMm: 1100, widthMm: 1100, heightMm: 2200 },
  },
};

// Container Specs
export const CONTAINER_SPECS = {
  '20ft': {
    name: '20피트 컨테이너 (20ft Dry)',
    maxWeightKg: 21600, // Safe payload 21.6 tons
    maxCbm: 28, // Practical usable CBM (theoretical 33 CBM)
  },
  '40ft': {
    name: '40피트 컨테이너 (40ft Dry)',
    maxWeightKg: 26500, // Safe payload 26.5 tons
    maxCbm: 58, // Practical usable CBM (theoretical 67 CBM)
  },
};

export function calculateMixedOrder(items: OrderItem[]): CalculationResult {
  let totalOrderWeightKg = 0;
  let totalNetWeightKg = 0;
  let totalGrossWeightKg = 0;
  let totalPallets = 0;
  let totalPalletWeightKg = 0;
  let totalWeightKg = 0;
  let totalCbm = 0;

  const itemResults: ItemCalculationResult[] = items.map((item) => {
    const config = PACKAGING_CONFIGS[item.packagingType];
    const orderWeight = Math.max(0, item.orderWeightKg);
    const unitCount = config.unitWeightKg > 0 ? Math.round(orderWeight / config.unitWeightKg) : 0;
    const netWeight = orderWeight;

    let grossWeight = 0;
    if (item.packagingType === 'G1') {
      // G1: (수량 / 25) * 25.6
      grossWeight = (orderWeight / 25) * 25.6;
    } else {
      grossWeight = orderWeight;
    }

    let requiredPallets = 0;
    let palletWeight = 0;
    if (item.hasPallet) {
      requiredPallets = Math.ceil(unitCount / config.itemsPerPallet);
      palletWeight = requiredPallets * config.palletWeightKg;
    }

    const itemTotalWeight = grossWeight + palletWeight;
    // CBM rule: 1000KG당 곱하기 1.6
    const itemCbm = (grossWeight / 1000) * 1.6;

    totalOrderWeightKg += orderWeight;
    totalNetWeightKg += netWeight;
    totalGrossWeightKg += grossWeight;
    totalPallets += requiredPallets;
    totalPalletWeightKg += palletWeight;
    totalWeightKg += itemTotalWeight;
    totalCbm += itemCbm;

    const palletSizeDesc =
      item.packagingType === 'G1'
        ? '1300x1100x1400mm (팔레트당 40개)'
        : '1100x1100x2200mm (팔레트당 2개)';

    return {
      id: item.id,
      packagingType: item.packagingType,
      orderWeightKg: orderWeight,
      unitCount,
      netWeightKg: netWeight,
      grossWeightKg: grossWeight,
      requiredPallets,
      totalPalletWeightKg: palletWeight,
      totalWeightKg: itemTotalWeight,
      cbm: itemCbm,
      palletSizeDesc,
    };
  });

  // Ensure total CBM precisely follows (totalGrossWeightKg / 1000) * 1.6
  totalCbm = (totalGrossWeightKg / 1000) * 1.6;

  // Container checks
  const checkContainer = (maxWeight: number, maxCbm: number) => {
    const weightStatus = totalWeightKg <= maxWeight ? 'OK' : 'EXCEEDED';
    const volumeStatus = totalCbm <= maxCbm ? 'OK' : 'EXCEEDED';
    const canFit = weightStatus === 'OK' && volumeStatus === 'OK';

    const utilizationWeight = Math.min(100, Math.round((totalWeightKg / maxWeight) * 100));
    const utilizationVolume = Math.min(100, Math.round((totalCbm / maxCbm) * 100));

    // Max loadable weight in KG based on container constraints
    const weightRatio = totalWeightKg > 0 ? totalWeightKg / (totalOrderWeightKg || 1) : 1;
    const cbmPerKg = totalOrderWeightKg > 0 ? totalCbm / totalOrderWeightKg : 1;

    const maxWeightByLimit = maxWeight / (weightRatio > 0 ? weightRatio : 1);
    const maxWeightByCbm = cbmPerKg > 0 ? maxCbm / cbmPerKg : maxWeightByLimit;
    const maxLoadableWeightKg = Math.max(0, Math.floor(Math.min(maxWeightByLimit, maxWeightByCbm)));

    return {
      canFit,
      weightStatus: weightStatus as 'OK' | 'EXCEEDED',
      volumeStatus: volumeStatus as 'OK' | 'EXCEEDED',
      maxLoadableWeightKg,
      utilizationWeight,
      utilizationVolume,
    };
  };

  const container20ft = checkContainer(CONTAINER_SPECS['20ft'].maxWeightKg, CONTAINER_SPECS['20ft'].maxCbm);
  const container40ft = checkContainer(CONTAINER_SPECS['40ft'].maxWeightKg, CONTAINER_SPECS['40ft'].maxCbm);

  return {
    items: itemResults,
    totalOrderWeightKg,
    totalNetWeightKg,
    totalGrossWeightKg,
    totalPallets,
    totalPalletWeightKg,
    totalWeightKg,
    totalCbm,
    container20ft,
    container40ft,
  };
}
