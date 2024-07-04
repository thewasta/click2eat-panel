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

    const {data: _, error} = await supabase.from('business_user_pivot').insert({
        business: business[0].id,
        user: user.id
    }).select('*');

    if (error) {
        throw new Error('error en la tabla pivote');
    }
}

export async function registerBusinessLocal(values: FormData) {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();
    const {
        data: businessUserPivot,
        error: businessUserPivotError
    } = await supabase.from('business_user_pivot').select('*').eq('user', user?.id);

    if (businessUserPivotError) throw new Error('Error en tabla pivote');

    const business = businessUserPivot[0];

    const image = values.get('image');

    const {data, error} = await supabase.from('business_local').insert({
        business_id: business.business,
        address: values.get('address'),
        postal_code: values.get('postalCode'),
        town: values.get('town'),
        province: values.get('province'),
        country: values.get('country')
    }).select('*');
    if (error && !data) {
        console.log({
            error
        })
        throw new Error('Error al guardar local');
    }
    const {
        data: _,
        error: businessLocalPivotError
    } = await supabase.from('business_local_user_pivot').insert({
        business_local: data[0].id,
        user: user?.id
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
        await supabase.storage.from('click2eat').upload(`${business.business}/${data[0].id}_business_local`, image);
    }
}