import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Warehouse} from "../model/warehouse";


@Injectable({providedIn: 'root'})
export class WarehouseService {
  private apiUrl = `${environment.backendPrefix}/api/v1/warehouse`;

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get(`${this.apiUrl}`);
  }

  save(warehouse: Warehouse) {
    return this.http.post(`${this.apiUrl}`, warehouse);
  }

  update(warehouse: Warehouse) {
    return this.http.put(`${this.apiUrl}`, warehouse);
  }

}
