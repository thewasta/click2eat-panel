'use server'

import {createClient} from "@/lib/supabase/server";

export async function retrieve(): Promise<any> {
    const supabase = createClient();
    const {data, error} = await supabase.from('category').select('*');
    if (error) throw new Error('Error al obtener las categorías');
    return data;
}