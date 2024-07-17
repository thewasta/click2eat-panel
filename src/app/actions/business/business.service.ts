'use server'
import {createClient} from "@/lib/supabase/server";

export async function retrieve(): Promise<any> {
    const supabase = createClient();
    const {data} = await supabase.from('business')
        .select('*,business_user_pivot!inner(user_id)');
    if (data)
    return data[0];
}