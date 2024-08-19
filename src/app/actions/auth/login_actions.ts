'use server'

import {TypedFormData} from "@/_lib/_hooks/useFormData";
import {LoginAccountDto} from "@/types/auth/LoginAccount.types";
import {createClient} from "@/_lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import * as Sentry from "@sentry/node";

export async function login(formData: TypedFormData<LoginAccountDto>) {
    const supabase = createClient();
    const {data, error} = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get('password') as string
    });

    //@info ONLY FOR DEVELOPMENT REMOVE WHEN GO PROD
    // await supabase.auth.updateUser({
    //     data: {
    //         hasBusiness: false,
    //         hasBusinessLocal: false
    //     }
    // })

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
    redirect('/')
}

export async function logout() {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();

    if (authError) {
        throw new Error('Not valid session');
    }

    await supabase.auth.updateUser({
        data: {
            current_session: null
        }
    });

    const {data: _, error} = await supabase.from('user_session').insert({
        user_id: user?.id,
        local_id: user?.user_metadata.current_session,
        logout_at: new Date()
    });

    if (error) {
        throw new Error(error.message);
    }
    await supabase.auth.signOut();
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function selectBusiness(businessLocalId: string) {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();
    if (authError) {
        throw new Error('Invalid session');
    }
    if (!user) {
        throw new Error('Invalid session');
    }

    await supabase.auth.updateUser({
        data: {
            current_session: businessLocalId
        }
    });

    const {data: _, error} = await supabase.from('user_session').insert({
        user_id: user?.id,
        local_id: businessLocalId
    });

    if (error) {
        Sentry.captureException(error, {
            level: 'error',
            user: user
        });
        throw new Error(error.message);
    }
    revalidatePath('/mybusiness', 'layout');
    redirect('/');
}