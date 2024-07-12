'use server'

import {createClient} from "@/lib/supabase/server";
import {TypedFormData} from "@/_lib/_hooks/useFormData";
import {type CreateProductDTO} from "@/app/dashboard/products/formValidation";
import {Database} from "@/types/database/database";

const TABLE_NAME = 'product';

export async function retriever(): Promise<any> {
    const supabase = createClient();
    const {data, error} = await supabase.from(TABLE_NAME).select('*,category(name),sub_category(name)');

    if (error) throw new Error(error.message);
    return data;
}

export async function create(values: TypedFormData<CreateProductDTO>): Promise<any> {
    const supabase = createClient();

    const {data: businessLocal} = await supabase.from('business_local')
        .select('*,business_local_user_pivot!inner(user_id)').single();

    if (!businessLocal) throw new Error('Business Local not found');

    const images = values.getAll('images');

    const productsImages: string[] = [];
    if (images) {
        for await (const image of images) {
            const imageFileUid = crypto.randomUUID();
            const imagePath = `${businessLocal.business_id}/${businessLocal.business_local_id}/products/${imageFileUid}`;
            await supabase.storage.from('click2eat')
                .upload(imagePath, image)
            productsImages.push(imagePath);
        }
    }

    const productStatus = values.get('status') as string;
    let status;
    if (productStatus === '') {
        status = "DRAFT"
    } else {
        status = productStatus;
    }

    const {data, error} = await supabase.from(TABLE_NAME).insert({
        name: values.get('name') as string,
        price: parseFloat(values.get('price') as string),
        business_local: businessLocal.business_local_id,
        images: productsImages ?? [],
        active: values.get('active') === 'true',
        highlight: values.get('highlight') === 'true',
        category: values.get('category') as string,
        sub_category: values.get('sub_category') as string,
        description: values.get('description') as string,
        status: status as Database["public"]["Enums"]["product_status"],
        offer_price: parseFloat(values.get('offer_price') as string),
    }).select('*').single();

    if (error) {
        await supabase.storage.from('click2eat')
            .remove(productsImages);
        throw new Error('Product not created')
    }
}

export async function remove(): Promise<any> {

}