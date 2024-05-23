import {User} from "@/lib/models/Account/User";
import {Business} from "@/lib/models/Account/Business";

export interface LoginResponse {
    token: string;
    user: User
    business: Business
}