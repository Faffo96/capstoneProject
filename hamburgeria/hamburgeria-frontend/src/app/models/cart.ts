import { Product } from "./product";
import { Reservation } from "./reservation";
import { User } from "./user";


export interface Cart {
    id: number;
    reservation: Reservation;
    creationDate: string;
    productList: Product[];
    user: User;
    total: number;
    paid: boolean;
    delivery: boolean;
    deliveryFee: number;
  }
  
