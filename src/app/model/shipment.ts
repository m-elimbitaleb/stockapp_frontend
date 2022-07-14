export class Shipment {
  id: number;
  reference: string;
  shipper: string;
  creatorName: string;
  crossDock: boolean;
  createdAt: Date;
  items: number[]

  constructor(crossDock?: boolean) {
    this.crossDock = !!crossDock
  }

}
