'use server'

import {RegisterProfileDTO} from "@/components/auth/RegisterProfile";
import {TypedFormData} from "@/_lib/_hooks/useFormData";
import {createClient} from "@/_lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function registerProfile(registerProfile: TypedFormData<RegisterProfileDTO>) {
    const supabase = createClient();
    const {data: userData, error: authError} = await supabase.auth.getUser();
    if (authError) {
        throw new Error(authError.message);
    }
    const avatar = registerProfile.get('avatar');
    const avatarUid = crypto.randomUUID();
    let avatarURL: null | string = `avatar/${avatarUid}`
    const fullName = `${registerProfile.get('name')} ${registerProfile.get('lastname')}`;
    if (avatar) {
        const {data, error} = await supabase.storage.from('click2eat').upload(avatarURL, avatar);
        if (error) avatarURL = null;
    }

    const {data, error} = await supabase.auth.updateUser({
        data: {
            name: fullName,
            full_name: fullName,
            avatar_url: avatarURL,
        }
    });

    if (error) throw new Error(error.message);

    revalidatePath('/register/profile', 'page');
    redirect('/register/business');
}