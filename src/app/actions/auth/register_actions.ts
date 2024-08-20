'use server'

import {RegisterProfileDTO} from "@/components/auth/RegisterProfile";
import {TypedFormData} from "@/_lib/_hooks/useFormData";
import {createClient} from "@/_lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {RegisterFormDTO} from "@/components/auth/RegisterBusiness";
import {RegisterBusinessLocalDto} from "@/components/auth/RegisterBusinessLocal";
import * as Sentry from "@sentry/node";

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

    if (authError) {
        Sentry.captureException(authError);
        throw new Error(authError.message);
    }

    if (!user) {
        Sentry.captureException(user);
        throw new Error('Not valid session');
    }

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

    if (businessError && business === null) {
        Sentry.captureException(businessError, {
            user: user
        });
        throw new Error('Error al crear la empresa');
    }

    await supabase.auth.updateUser({
        data: {
            hasBusiness: true,
        },
    });

    const {data: role} = await supabase.from('roles').select().eq('name', 'OWNER').single();

    await supabase.from('user').update({
        role: role.id
    }).eq('user_id', user.id);

    const {data: _, error} = await supabase.from('business_local_user_pivot').insert({
        business_id: business[0].business_id,
        user_id: user.id
    }).select('*');

    if (error) {
        Sentry.captureException(error, {
            user: user
        });
        throw new Error('error en la tabla pivote');
    }
    revalidatePath('/register/business', 'layout');
    redirect('/register/local');
}

export async function registerBusinessLocal(formData: TypedFormData<RegisterBusinessLocalDto>) {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();
    if (authError) throw new Error(authError.message);
    if (!user) throw new Error('Not valid session');

    const {
        data: businessUserPivot,
        error: businessUserPivotError
    } = await supabase.from('business_local_user_pivot').select('*');

    if (businessUserPivotError) {
        Sentry.captureException(businessUserPivotError, {
            user: user,
            level: 'error',
        });
        throw new Error('Business Local Pivot Error');
    }

    if (businessUserPivot?.length > 1) {
        Sentry.captureException('User with more than 1 business', {
            user: user,
            level: 'error',
        });
        throw new Error('No es posible crear el local. Por favor, contáctanos')
    }

    if (!businessUserPivot) {
        Sentry.captureException(businessUserPivotError, {
            level: 'error',
            user: user
        });
        throw new Error('No business found');
    }

    const businessPivot = businessUserPivot[0];
    const image = formData.get('image');
    const infoFromBusiness = formData.get('businessInfo');

    let businessLocalInformation: {
        name?: string;
        address?: string;
        postal_code?: string;
        town?: string;
        province?: string;
        country?: string;
    } = {}
    if (infoFromBusiness) {
        const {
            data: business,
            error: businessError
        } = await supabase.from('business').select('*').eq('business_id', businessPivot.business_id).single();
        if (businessError) {
            Sentry.captureException(businessError, {
                user: user,
                level: 'error',
            });
        }

        businessLocalInformation = {
            name: business.name,
            address: business.address,
            postal_code: business.postal_code,
            town: business.town,
            province: business.province,
            country: business.country,
        }
    }
    const {data, error} = await supabase.from('business_local').insert({
        business_id: businessPivot.business_id,
        address: businessLocalInformation.address ?? formData.get('address'),
        postal_code: businessLocalInformation.postal_code ?? formData.get('postalCode'),
        town: businessLocalInformation.town ?? formData.get('town'),
        province: businessLocalInformation.province ?? formData.get('province'),
        country: businessLocalInformation.country ?? formData.get('country'),
        time_zone: formData.get('timeZone'),
        abbreviation: formData.get('abbreviation')
    }).select('*');

    if (error && !data) {
        Sentry.captureException(error, {
            user: user,
            level: 'error'
        })
        throw new Error('Error al guardar local');
    }

    const {
        data: _,
        error: businessLocalPivotError
    } = await supabase.from('business_local_user_pivot').insert({
        business_local_id: data[0].business_local_id,
        user_id: user?.id
    });
    if (businessLocalPivotError) {
        Sentry.captureException(businessLocalPivotError, {
            user: user,
            level: 'error',
        })
        throw new Error('Ha ocurrido un error');
    }
    await supabase.auth.updateUser({
        data: {
            hasBusinessLocal: true
        }
    });
    revalidatePath('/register/local', 'layout');
    redirect('/');
}