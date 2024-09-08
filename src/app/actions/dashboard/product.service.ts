"use server"

import {handleRequest} from "@/_request/request";
import {getComplexFormDataValue, TypedFormData} from "@/_lib/_hooks/useFormData";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";
import {getUser} from "@/_lib/_hooks/useUser";
import {Tables} from "@/types/database/database";
import {getSignedImages} from "@/_lib/supabase/admin";

export async function getSignedImageUrl(imagePath: string[]) {
    const {supabase} = await getUser();
    const signedUrls = await Promise.all(
        imagePath.map(async (path) => {
            const {data} = await supabase
                .storage
                .from('click2eat')
                .createSignedUrl(path, 60 * 30);
            return data?.signedUrl;
        })
    );
    return signedUrls.filter(Boolean) as string[];
}

export async function productRetriever(): Promise<Tables<'products'>[]> {
    const {supabase} = await getUser();
    const {data, error} = await supabase.from('products')
        .select('*,categories(name),sub_categories(name)');
    if (error) {
        throw new Error(error.message);
    }

    return await Promise.all(data.map(async (product) => {
        const imageUrls = await Promise.all(product.images.map(async (imagePath: string) => {
            const existingUrl = await getSignedImages(imagePath)

            if (existingUrl) {
                return existingUrl;
            }

            return null;
        }));

        return {...product, imageUrls: imageUrls.filter(Boolean)};
    }));
}

type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'DISCONTINUED'
type Variant = {
    name: string;
    price: number;
    isRequired: boolean;
}
type VariantGroup = {
    name: string;
    variants: Variant[]
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

export async function removeProduct(productId: string): Promise<void> {
    const {supabase} = await getUser();
    const {data, error} = await supabase.from('products').delete().eq('id', productId);
    if (error) {
        throw new Error(error.message);
    }
}

export async function editProduct(productId: string): Promise<Tables<'products'>> {
    const {supabase} = await getUser()
    const {data, error} = await supabase.from('products').select().eq('id', productId).maybeSingle();
    if (error) throw new Error(error.message);
    return data;
}

export async function productById(productId: number): Promise<any> {

}