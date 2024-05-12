import {Business} from "@/lib/models/Account/Business";

export type User = {
    id: number;
    email: string;
    lastname: string;
    name: string;
    username: string;
    status: string;
    rol: string;
    business: Business;
}