export class InventoryItem {
  id: number;
  name: string;
  manufacturer: string;
  reference: string;
  description: string;
  purchasePrice: number = 0;
  universalProductCode: string;
  createdAt: Date;
  storageDate: Date;
  crossDock: boolean;
}
