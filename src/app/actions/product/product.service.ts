'use server'

import {createClient} from "@/lib/supabase/server";
import {Database} from "@/types/database/database";
import {TypedFormData} from "@/_lib/_hooks/useFormData";
import {type CreateProductDTO} from "@/app/dashboard/products/formValidation";

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

    await supabase.from(TABLE_NAME).insert({
        name: values.get('name') as string,
        price: parseFloat(values.get('price') as string),
        business_local: businessLocal.business_local_id,
        images: [],
        active: values.get('active') === 'true',
        highlight: values.get('highlight') === 'true',
        category: values.get('category') as string,
        sub_category: values.get('sub_category') as string,
        description: values.get('description') as string,
        status: values.get('highlight') as Database["public"]["Enums"]["product_status"],
        offer_price: parseFloat(values.get('offer_price') as string),
    });
}

export async function remove(): Promise<any> {

}