import {retrieveProducts} from "@/_request/product/productRetriever";
import {columns, Product} from "@/components/ui/colums";
import {ProductTable} from "@/components/products/product-table";

async function getProducts(): Promise<Product[]> {
    const response = await retrieveProducts();
    //@ts-ignore
    return response.message as Product[];
}

export default async function ProductsPage() {
    return (
        <div className={"col-span-3"}>
            <ProductTable columns={columns}/>
        </div>
    );
}