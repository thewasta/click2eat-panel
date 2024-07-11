'use server'
import {createClient} from "@/lib/supabase/server";
import {RegisterBusinessDto} from "@/app/(auth)/register/business/formValidation";

export async function registerBusiness(formValues: RegisterBusinessDto) {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();
    if (authError || user === null) throw new Error('No existe sesión de usuario');
    const {data: business, error: businessError} = await supabase.from('business').insert({
        name: formValues.businessName,
        address: formValues.address,
        postal_code: formValues.postalCode,
        country: formValues.country,
        province: formValues.province,
        town: formValues.town,
        document_type: 'NIF',
        document_number: formValues.document
    }).select('*');
    if (businessError && business === null) throw new Error('Error al crear la empresa');
    await supabase.auth.updateUser({
        data: {
            hasBusiness: true,
        },
    });

    //@todo UPDATE user role to owner
    const {data: _, error} = await supabase.from('business_user_pivot').insert({
        business_id: business[0].business_id,
        user_id: user.id
    }).select('*');

    if (error) {
        throw new Error('error en la tabla pivote');
    }
}

export async function registerBusinessLocal(values: FormData) {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) throw new Error('User session not valid')
    const {
        data: businessUserPivot,
        error: businessUserPivotError
    } = await supabase.from('business_user_pivot').select('*').eq('user_id', user.id);

    if (businessUserPivotError) throw new Error('Error en tabla pivote');

    const business = businessUserPivot[0];

    const image = values.get('image');

    const {data, error} = await supabase.from('business_local').insert({
        business_id: business.business_id,
        address: values.get('address') as string,
        postal_code: values.get('postalCode') as string,
        town: values.get('town') as string,
        province: values.get('province') as string,
        country: values.get('country') as string
    }).select('*');
    if (error && !data) {
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
        throw new Error('Error en la tabla pivote');
    }
    await supabase.auth.updateUser({
        data: {
            hasBusinessLocal: true
        }
    });
    if (image) {
        await supabase.storage.from('click2eat').upload(`${business.business_id}/${data[0].business_local_id}_business_local`, image);
    }
}