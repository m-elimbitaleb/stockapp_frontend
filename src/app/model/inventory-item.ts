export enum MeasureUnit {
  BOX = "BOX",
  DOZEN = "DOZEN",
  GRAMS = "GRAMS",
  KILOGRAMS = "KILOGRAMS",
  METERS = "METERS",
  TABLETS = "TABLETS",
  UNITS = "UNITS",
  PIECES = "PIECES",
  PAIRS = "PAIRS"
}

export class InventoryItem {
  id: number;
  name: string;
  measureUnit: MeasureUnit;
  manufacturer: string;
  reference: string;
  description: string;
  purchasePrice: number = 0;
  quantity: number = 1;
  universalProductCode: string;
  createdAt: Date;
}
