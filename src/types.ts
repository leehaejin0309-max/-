export type PackagingType = 'G1' | 'F1' | 'F4' | 'F5';

export interface PackagingInfo {
  code: PackagingType;
  name: string;
  unitWeightKg: number; // Net weight per unit
  itemsPerPallet: number;
  palletWeightKg: number; // 10 kg
  palletDimensions: {
    lengthMm: number;
    widthMm: number;
    heightMm: number;
  };
}

export interface OrderItem {
  id: string;
  packagingType: PackagingType;
  orderWeightKg: number; // Order quantity in KG
  hasPallet: boolean;
}

export interface ItemCalculationResult {
  id: string;
  packagingType: PackagingType;
  orderWeightKg: number;
  unitCount: number; // Calculated number of bags/units
  netWeightKg: number;
  grossWeightKg: number;
  requiredPallets: number;
  totalPalletWeightKg: number;
  totalWeightKg: number;
  cbm: number;
  palletSizeDesc: string;
}

export interface CalculationResult {
  items: ItemCalculationResult[];
  totalOrderWeightKg: number;
  totalNetWeightKg: number;
  totalGrossWeightKg: number;
  totalPallets: number;
  totalPalletWeightKg: number;
  totalWeightKg: number;
  totalCbm: number;
  container20ft: {
    canFit: boolean;
    weightStatus: 'OK' | 'EXCEEDED';
    volumeStatus: 'OK' | 'EXCEEDED';
    maxLoadableWeightKg: number;
    utilizationWeight: number; // percentage
    utilizationVolume: number; // percentage
  };
  container40ft: {
    canFit: boolean;
    weightStatus: 'OK' | 'EXCEEDED';
    volumeStatus: 'OK' | 'EXCEEDED';
    maxLoadableWeightKg: number;
    utilizationWeight: number; // percentage
    utilizationVolume: number; // percentage
  };
}
