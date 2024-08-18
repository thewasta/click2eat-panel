'use server'

import {TypedFormData} from "@/_lib/_hooks/useFormData";
import {LoginAccountDto} from "@/types/auth/LoginAccount.types";
import {createClient} from "@/_lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function login(formData: TypedFormData<LoginAccountDto>) {
    const supabase = createClient();
    const {data, error} = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get('password') as string
    });

    //@info ONLY FOR DEVELOPMENT REMOVE WHEN GO PROD
    await supabase.auth.updateUser({
        data: {
            hasBusiness: false,
            hasBusinessLocal: false
        }
    })

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
    redirect('/')
}