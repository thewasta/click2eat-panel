import {retrieveProducts} from "@/_request/product/productRetriever";
import {columns, Product} from "@/components/ui/colums";
import {ProductTable} from "@/components/ui/product-table";

async function getProducts(): Promise<Product[]> {
    const response = await retrieveProducts();

    return response.message?.response as Product[];
}

export default async function ProductsPage() {
    const products = await getProducts();
    return (
        <div className={"col-span-3"}>
            <ProductTable columns={columns} data={products}/>
        </div>
    );
}