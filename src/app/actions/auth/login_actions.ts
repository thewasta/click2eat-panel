'use server'

import {TypedFormData} from "@/_lib/_hooks/useFormData";
import {LoginAccountDto} from "@/types/auth/LoginAccount.types";
import {createClient} from "@/_lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import * as Sentry from "@sentry/node";
import {ResponseResult} from "@/lib/types/ResponseResult";

export async function login(formData: TypedFormData<LoginAccountDto>): Promise<ResponseResult<null> | void> {
    const supabase = createClient();
    const {error} = await supabase.auth.signInWithPassword({
        email: formData.get("email") as string,
        password: formData.get('password') as string
    });

    if (error) {
        return {
            success: false,
            error: error.message!
        }
    }
    const {data: {user}} = await supabase.auth.getUser()

    // @info ONLY FOR DEVELOPMENT REMOVE WHEN GO PROD
    // await supabase.auth.updateUser({
    //     data: {
    //         hasBusiness: true,
    //         hasBusinessLocal: true
    //     }
    // })
    await supabase.from('users_session').insert({
        user_id: user?.id as string,
        business_establishment_id: user?.user_metadata.current_session,
        action: 'LOGIN'
    });

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function logout(): Promise<ResponseResult<null> | void> {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();

    if (authError) {
        Sentry.captureException(authError, {
            level: "warning"
        });
        return {
            success: false,
            error: 'Invalid session'
        }
    }

    const {error} = await supabase.from('users_session').insert({
        user_id: user?.id as string,
        business_establishment_id: user?.user_metadata.current_session,
        action: 'LOGOUT'
    });
    await supabase.auth.updateUser({
        data: {
            current_session: null
        }
    });
    if (error) {
        Sentry.captureException(error);
        return {
            success: false,
            error: 'Error on insert user session'
        };
    }
    await supabase.auth.signOut();
    revalidatePath('/', 'layout')
    redirect('/')
}

export async function selectBusiness(businessLocalId: string): Promise<ResponseResult<null> | void> {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();

    if (authError) {
        throw new Error('Invalid session');
    }

    if (!user) {
        throw new Error('Invalid session');
    }

    const {error} = await supabase.from('users_session').insert({
        user_id: user?.id,
        business_establishment_id: businessLocalId,
        action: 'LOGIN'
    });

    await supabase.auth.updateUser({
        data: {
            current_session: businessLocalId
        }
    });

    if (error) {
        Sentry.captureException(error, {
            level: "error"
        });
        return {
            success: false,
            error: 'Error on insert user session'
        };
    }
    revalidatePath('/mybusiness', 'layout');
    redirect('/');
}