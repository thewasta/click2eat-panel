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
        name: formData.get('businessName') as string,
        address: formData.get('address') as string,
        postal_code: formData.get('postalCode') as string,
        country: formData.get('country') as string,
        province: formData.get('province') as string,
        town: formData.get('town') as string,
        document_type: 'NIF',
        document_number: formData.get('document') as string,
        contact_number: formData.get('phone') as string,
        user_id: user.id
    });

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
    revalidatePath('/register/business', 'layout');
    redirect('/register/local');
}

export async function registerBusinessLocal(formData: TypedFormData<RegisterBusinessLocalDto>) {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();
    if (authError) throw new Error(authError.message);
    if (!user) throw new Error('Not valid session');

    const {
        data: businessByUser,
        error: businessError
    } = await supabase.from('business').select().eq('user_id', user.id);

    if (businessError) {
        Sentry.captureException(businessError, {
            user: user
        });
        throw new Error('No es posible crear el local. Por favor, contáctanos')
    }

    if (businessByUser?.length > 1) {
        Sentry.captureException('User with more than 1 business', {
            user: user,
            level: 'error',
        });
        throw new Error('No es posible crear el local. Por favor, contáctanos')
    }

    const business = businessByUser[0];
    const image = formData.get('image');
    const infoFromBusiness = formData.get('businessInfo');

    let businessLocalInformation: {
        name?: string;
        address?: string;
        postal_code?: string;
        town?: string;
        province?: string;
        country?: string;
        contact_phone?: string;
    } = {}
    if (infoFromBusiness) {
        businessLocalInformation = {
            name: business.name,
            address: business.address,
            postal_code: business.postal_code,
            town: business.town,
            province: business.province,
            country: business.country,
            contact_phone: business.contact_number
        }
    }

    const {data: businessLocal, error} = await supabase.from('business_establishments').insert({
        business_id: business.id,
        address: businessLocalInformation.address ?? formData.get('address') as string,
        postal_code: businessLocalInformation.postal_code ?? formData.get('postalCode') as string,
        town: businessLocalInformation.town ?? formData.get('town') as string,
        province: businessLocalInformation.province ?? formData.get('province') as string,
        country: businessLocalInformation.country ?? formData.get('country') as string,
        contact_phone: businessLocalInformation.contact_phone ?? formData.get('phone') as string,
        gmt: formData.get('timeZone') as string,
        name_abbreviation: formData.get('abbreviation') as string
    }).select('*');

    if (error) {
        Sentry.captureException(error, {
            user: user,
            level: 'error'
        })
        throw new Error('No es posible crear el local. Por favor, contáctanos');
    }

    if (!businessLocal?.length) {
        Sentry.captureException('Local not found', {
            user: user
        });
        throw new Error('No es posible crear el local. Por favor, contáctanos');
    }
    const {
        data: _,
        error: businessAssignmentsError
    } = await supabase.from('business_user_assignments').insert({
        user_id: user.id,
        business_establishments_id: businessLocal[0].id,
        role: 'OWNER'
    });

    if (businessAssignmentsError) {
        Sentry.captureException(businessAssignmentsError, {
            user
        });
        throw new Error('No es posible crear el local. Por favor, contáctanos');
    }

    await supabase.auth.updateUser({
        data: {
            hasBusinessLocal: true
        }
    });

    revalidatePath('/register/local', 'layout');
    redirect('/');
}