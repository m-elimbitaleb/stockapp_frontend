import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Shipment} from "../model/shipment";


@Injectable({providedIn: 'root'})
export class ShipmentService {
  private apiUrl = `${environment.backendPrefix}/api/v1/shipment`;

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get(`${this.apiUrl}`);
  }

  save(shipment: Shipment) {
    return this.http.post(`${this.apiUrl}`, shipment);
  }

  update(shipment: Shipment) {
    return this.http.put(`${this.apiUrl}`, shipment);
  }

  getItemsInShipments() {
    return this.http.get(`${this.apiUrl}/item-in-shipments`);
  }
}
