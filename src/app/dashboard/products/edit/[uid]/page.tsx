import {createClient} from "@/lib/supabase/server";
import ProductForm from "@/app/dashboard/products/components/productForm";

export default async function EditProductPage({params}: { params: { uid: string } }) {
    const supabase = createClient();
    const {data: product} = await supabase.from('product').select('*').eq('product_id', params.uid).single();
    const {data:categories} = await supabase.from('category').select('*');
    const handler = async () => {
        'use server'
    }

    return (
        <div>
            {
                product && categories ? <ProductForm
                    isEdit={true}
                    submitHandler={handler}
                    product={product}
                    categories={categories}
                /> : null
            }
        </div>
    )
}