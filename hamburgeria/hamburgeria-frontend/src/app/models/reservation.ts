import { Cart } from "./cart";
import { DiningTable } from "./dining-table";
import { User } from "./user";

export interface Reservation {
    creationDate: string;
    bookedDate: string;
    diningTable: DiningTable;
    user: User;
    participants: number;
    cart: Cart;
  }