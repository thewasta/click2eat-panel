'use server'

import {RegisterProfileDTO} from "@/components/auth/RegisterProfile";
import {TypedFormData} from "@/_lib/_hooks/useFormData";
import {createClient} from "@/_lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {RegisterFormDTO} from "@/components/auth/RegisterBusiness";

export async function registerProfile(registerProfile: TypedFormData<RegisterProfileDTO>) {
    const supabase = createClient();
    const {data: _, error: authError} = await supabase.auth.getUser();
    if (authError) {
        throw new Error(authError.message);
    }
    const avatar = registerProfile.get('avatar');
    const avatarUid = crypto.randomUUID();
    let avatarURL: null | string = `avatar/${avatarUid}`
    const fullName = `${registerProfile.get('name')} ${registerProfile.get('lastname')}`;
    if (avatar) {
        const {data: _, error} = await supabase.storage.from('click2eat').upload(avatarURL, avatar);
        if (error) avatarURL = null;
    }

    const {data: __, error} = await supabase.auth.updateUser({
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

export async function registerBusiness(formData: TypedFormData<RegisterFormDTO>) {
    const supabase = createClient();

    const {data: {user}, error: authError} = await supabase.auth.getUser();

    if (authError) throw new Error(authError.message);
    if (!user) throw new Error('Not valid session');

    const {data: business, error: businessError} = await supabase.from('business').insert({
        name: formData.get('businessName'),
        address: formData.get('address'),
        postal_code: formData.get('postalCode'),
        country: formData.get('country'),
        province: formData.get('province'),
        town: formData.get('town'),
        document_type: 'NIF',
        document_number: formData.get('document'),
    }).select('*');

    console.log(business);
    if (businessError && business === null) throw new Error('Error al crear la empresa');

    await supabase.auth.updateUser({
        data: {
            hasBusiness: true,
        },
    });

    await supabase.from('user').update({
        role: 2
    }).eq('user_id', user.id);

    const {data: _, error} = await supabase.from('business_user_pivot').insert({
        business_id: business[0].business_id,
        user_id: user.id
    }).select('*');

    if (error) {
        throw new Error('error en la tabla pivote');
    }
    revalidatePath('/register/business', 'layout');
    redirect('/register/local');
}