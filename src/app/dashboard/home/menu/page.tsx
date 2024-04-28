import {retrieveProducts} from "@/_request/product/productRetriever";
import {columns, Product} from "@/app/components/ui/colums";
import {DataTable} from "@/app/components/ui/data-table";

async function getProducts(): Promise<Product[]> {
    const response = await retrieveProducts();

    return response.message as Product[];
}

export default async function ProductsPage() {
    const products = await getProducts();
    return (
        <div className={"col-span-3"}>
            <DataTable columns={columns} data={products}/>
        </div>
    );
}