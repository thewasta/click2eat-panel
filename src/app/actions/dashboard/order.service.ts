'use server'

import {getUser} from "@/_lib/_hooks/useUser";
import {Tables} from "@/types/database/database";
import {ResponseResult} from "@/lib/types/ResponseResult";

type Product = Tables<'products'>;

type ProductCart = Product & {
    quantity: number;
    comments?: string[];
}

interface CreateOrderProps {
    tableDinnerId: string;
    products: ProductCart[]
}

export async function createOrder({tableDinnerId, products}: CreateOrderProps): Promise<ResponseResult<string>> {
    const {supabase, user} = await getUser();
    const {data: order, error: orderError} = await supabase.from('orders').insert({
        establishment_table_dinner_id: tableDinnerId,
        establishment_id: user.user_metadata.current_session,
        attended_by: user.id,
        method: 'TPV',
        sub_total: 0,
        payment_method: 'NA'
    }).select();

    if (orderError) {
        console.error(orderError);
        return {
            success: false,
            error: "Error creating"
        }
    }
    const {error: orderItemsError} = await supabase.from('order_items').insert(
        products.map(product => (
                {
                    order_id: order[0].id,
                    product_id: product.id,
                    quantity: product.quantity,
                    unit_price: product.price,
                    total_price: product.price * product.quantity
                }
            )
        )
    );
    if (orderItemsError) {
        return {
            success: false,
            error: "Error inserting items"
        }
    }
    return {
        success: true,
        data: "CREATED"
    }
}