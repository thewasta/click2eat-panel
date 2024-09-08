"use server"

import {handleRequest} from "../request";
import {TypedFormData} from "@/_lib/_hooks/useFormData";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";

export async function productRetriever(): Promise<any> {
    const ENDPOINT = 'auth/products';
    try {
        const response = await handleRequest('GET', ENDPOINT);
        return {
            error: false,
            errorDescription: null,
            //todo API DEBE DEVOLVER EL MISMO RESPUESTA QUE EL RESTO, ESTÁ DEVOLVIENDO ARRAY
            //@ts-ignore
            message: response
        }
    } catch (e) {
        return {
            error: true,
            errorDescription: 'Unhandled error',
            message: null
        }
    }
}

export async function createProduct(formData: TypedFormData<CreateProductDTO>) {
    const {user, supabase} = await getUser();
    const formPublishDate = formData.get('publishDate') as string;
    let publishDate;
    if (formPublishDate) {
        publishDate = new Date(formPublishDate);
    }
    const images = formData.getAll('images');

    const status = formData.get('status') as ProductStatus;
    const {data: product, error} = await supabase.from('products').insert({
        name: formData.get('productName') as string,
        description: formData.get('description') as string,
        business_establishment_id: user.user_metadata.current_session,
        publish_date: publishDate,
        price: formData.get('price') as string,
        offer: formData.get('offerPrice') as string,
        highlight: formData.get('highlight'),
        status: status,
        category_id: formData.get('category'),
        sub_category_id: formData.get('subCategory'),
    }).select();

    if (error || !product) {
        throw new Error('No se ha sido posible crear el producto');
    }
    const formVariantGroups = getComplexFormDataValue<VariantGroup[]>(formData, 'variantGroups');

    if (Array.isArray(formVariantGroups)) {
        for (const group of formVariantGroups) {
            const {data: groupData, error: groupError} = await supabase.from('product_variants_group').insert({
                business_establishment_id: user.user_metadata.current_session,
                name: group.name,
                product_id: product[0].id
            }).select();
            if (groupError) {
                console.error(groupError);
                continue;
            }
            const groupId = groupData[0].id;
            if (Array.isArray(group.variants)) {
                for (const variant of group.variants) {
                    const {error: variantError} = await supabase.from('product_variants').insert({
                        group_id: groupId,
                        name: variant.name,
                        extra_price: variant.price,
                        is_required: variant.isRequired,
                    });
                    if (variantError) {
                        console.error(variantError);
                        throw new Error(`Ha ocurrido un error al insertar la variante ${variant.name} del grupo ${group.name}`);
                    }
                }
            }
        }
    }
    const imagesUid = [];
    if (images) {
        for (const image of images) {
            const uid = crypto.randomUUID()
            const imagePath = `${user.user_metadata.current_session}/products/${uid}`;
            const {
                data, error
            } = await supabase.storage.from('click2eat').upload(imagePath, image);
            if (error) {
                console.error(error);
                continue;
            }
            imagesUid.push(imagePath);
        }
    }
    const {error: updateProductImageError} = await supabase.from('products')
        .update({
            images: imagesUid
        }).eq('id', product[0].id)

    if (updateProductImageError) {
        console.error(updateProductImageError);
    }
}

export async function removeProduct(productId: number): Promise<any> {
    const ENDPOINT = `api/v1/products/${productId}`;
    const req = await handleRequest('DELETE', ENDPOINT);
    if (req.error) {
        return {
            error: true,
            errorDescription: "Example",
            message: null
        }
    }

    return {
        error: false,
        errorDescription: null,
        message: null
    }
}

export async function editProduct(formData: FormData): Promise<any> {

    console.log(formData.get('name'))
    console.log(formData.get('price'))
    console.log(formData.get('description'))
    console.log(formData.get('category'))
}

export async function productById(productId: number): Promise<any> {

}