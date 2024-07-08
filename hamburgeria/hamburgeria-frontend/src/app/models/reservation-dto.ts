import { Cart } from "./cart";
import { DiningTable } from "./dining-table";
import { User } from "./user";

export interface ReservationDTO {
        bookedDate: string;
        diningTable: DiningTable;
        participants: number;
        cart: Cart;
      }