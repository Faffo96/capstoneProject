import { Product } from "./product";
import { Reservation } from "./reservation";
import { User } from "./user";


export interface Cart {
    id: number;
    creationDate: string;
    reservation: Reservation;
    productList: Product[];
    user: User;
    paid: boolean;
    delivery: boolean;
  }
  
