import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomizableProduct } from '../models/customizable-product';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CustomizableProductService {
  apiURL = environment.apiURL;

  constructor(private http:HttpClient) { }

  createCustomizableProduct(data: Partial<CustomizableProduct>) {
    return this.http.post<CustomizableProduct>(`${this.apiURL}api/customizableProducts`, data);
  }

  getCustomizableProducts() {
    return this.http.get<CustomizableProduct[]>(`${this.apiURL}api/customizableProducts`);
  }

  getCustomizableProduct(id: number) {
    return this.http.get<CustomizableProduct>(`${this.apiURL}api/customizableProducts/${id}`);
  }

  updateCustomizableProduct(id: number, data: Partial<CustomizableProduct>) {
    return this.http.patch<CustomizableProduct>(`${this.apiURL}api/customizableProducts/${id}`, data);
  }

  deleteCustomizableProduct(id: CustomizableProduct) {
    return this.http.delete(`${this.apiURL}api/customizableProducts/${id}`);
  }


}
