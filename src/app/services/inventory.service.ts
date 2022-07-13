import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {InventoryItem} from "../model/inventory-item";


@Injectable({providedIn: 'root'})
export class InventoryService {
  private apiUrl = `${environment.backendPrefix}/api/v1/inventory`;

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get(`${this.apiUrl}`);
  }

  save(inventoryItem: InventoryItem) {
    return this.http.post(`${this.apiUrl}`, inventoryItem);
  }

  update(inventoryItem: InventoryItem) {
    return this.http.put(`${this.apiUrl}`, inventoryItem);
  }

}
