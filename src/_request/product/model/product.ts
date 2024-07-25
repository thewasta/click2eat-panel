type ProductStatus = "ACTIVE" | "DISCONTINUE" | "INACTIVE";
export interface Product {
    "id": string;
    "name": string;
    "description": string;
    "price": number;
    "offerPrice": number;
    "publishDate": Date;
    "category": string;
    "subCategory": string;
    "status": ProductStatus;
    "highlight": boolean
    "businessUuid": string;
    "images": [];
}