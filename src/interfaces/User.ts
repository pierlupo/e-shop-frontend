import type {Role} from "./Role.ts";

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    roles: Role[];
    avatarUrl: (string | null);
    registrationDate: string;
    // cart?: Cart;
    // orders?: Order[];
}