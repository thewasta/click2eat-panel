"use server"

import {getComplexFormDataValue, TypedFormData} from "@/_lib/_hooks/useFormData";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";
import {getUser} from "@/_lib/_hooks/useUser";
import {Tables} from "@/types/database/database";
import {getSignedImages} from "@/_lib/supabase/admin";
import {SupabaseClient} from "@supabase/supabase-js";

type SortOrder = 'asc' | 'desc';

type ProductRetrieverProps = {
    page: number;
    pageSize: number;
    sortBy?: string;
    searchTerm?: string;
    sortOrder?: SortOrder;
}

type Product = Tables<'products'> & {
    categories: {
        name: string
    };
    images: string[];
    sub_categories: {
        name: string
    };
}

export async function productRetriever({
                                           page,
                                           pageSize,
                                           sortBy = 'created_at',
                                           sortOrder = 'desc',
                                           searchTerm
                                       }: ProductRetrieverProps): Promise<{
    products: Product[];
    totalCount: number
}> {
    const {supabase} = await getUser();
    const offset = (page - 1) * pageSize;
    const query = supabase.from('products')
        .select('*,categories(name),sub_categories(name)', {count: 'exact'})
        .order(sortBy, {ascending: sortOrder === 'asc'});

    if (searchTerm && searchTerm.length > 0) {
        if (searchTerm.length === 36) {
            query.eq('id', searchTerm)
        } else {
            query.ilike('name', `%${searchTerm}%`);
        }
    }

    const {data, error, count} = await query.range(offset, offset + pageSize - 1);

    if (error) {
        throw new Error(error.message);
    }

    const processImages = await Promise.all(data.map(async (product) => {
        const imageUrls = await Promise.all(product.images.map(async (imagePath: string) => {
            const existingUrl = await getSignedImages(imagePath)

            if (existingUrl) {
                return existingUrl;
            }

            return null;
        }));

        return {...product, imageUrls: imageUrls.filter(Boolean)};
    }));

    return {
        products: processImages,
        totalCount: count || 0
    }
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

export async function createProduct(formData: TypedFormData<CreateProductDTO>): Promise<Tables<'products'>> {
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
        console.error(error);
        throw new Error('No se ha sido posible crear el producto');
    }
    const formVariantGroups = getComplexFormDataValue<VariantGroup[]>(formData, 'variantGroups');

    if (Array.isArray(formVariantGroups)) {
        for (const group of formVariantGroups) {
            await createVariants(supabase, user, group, product[0].id);
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
    return product[0];
}

export async function removeProduct(productId: string): Promise<void> {
    const {supabase} = await getUser();
    const { data: oldProduct } = await supabase
        .from('products')
        .select('images')
        .eq('id', productId)
        .single();

    if (oldProduct && oldProduct.images) {
        for (const oldImage of oldProduct.images) {
            await supabase.storage.from('click2eat').remove([oldImage]);
        }
    }
    const {error} = await supabase.from('products').delete().eq('id', productId);
    if (error) {
        throw new Error(error.message);
    }
}

async function createVariants(
    supabase: SupabaseClient,
    user: { user_metadata: { current_session: string } },
    group: VariantGroup, productId: string) {
    const {data: groupData, error: groupError} = await supabase
        .from('product_variants_group')
        .insert({
            business_establishment_id: user.user_metadata.current_session,
            name: group.name,
            product_id: productId
        })
        .select();

    if (groupError) {
        console.error(groupError);
        return;
    }

    const groupId = groupData[0].id;

    if (Array.isArray(group.variants)) {
        for (const variant of group.variants) {
            const {error: variantError} = await supabase
                .from('product_variants')
                .insert({
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

export async function editProduct(formData: TypedFormData<CreateProductDTO>): Promise<Tables<'products'>> {
    const {user, supabase} = await getUser();
    const productId = formData.get('productId') as string; // Asumimos que se pasa el ID del producto a editar

    if (!productId) {
        throw new Error('No se proporcionó el ID del producto a editar');
    }
    const formPublishDate = formData.get('publishDate') as string;
    let publishDate;
    if (formPublishDate) {
        publishDate = new Date(formPublishDate);
    }
    const status = formData.get('status') as ProductStatus;
    const {data: updatedProduct, error: updateError} = await supabase
        .from('products')
        .update({
            name: formData.get('productName') as string,
            description: formData.get('description') as string,
            publish_date: publishDate,
            price: formData.get('price') as string,
            offer: formData.get('offerPrice') as string,
            highlight: formData.get('highlight'),
            status: status,
            category_id: formData.get('category'),
            sub_category_id: formData.get('subCategory'),
        })
        .eq('id', productId)
        .select();

    if (updateError || !updatedProduct) {
        console.error(updateError);
        throw new Error('No ha sido posible actualizar el producto');
    }
    const formVariantGroups = getComplexFormDataValue<VariantGroup[]>(formData, 'variantGroups');
    if (Array.isArray(formVariantGroups)) {
        await supabase.from('product_variants_group').delete().eq('product_id', productId);
        for (const group of formVariantGroups) {
            await createVariants(supabase, user, group, productId);
        }
    }
    const images = formData.getAll('images');
    const imagesUid = [];
    if (images && images.length > 0) {
        // Eliminar imágenes antiguas
        const { data: oldProduct } = await supabase
            .from('products')
            .select('images')
            .eq('id', productId)
            .single();

        if (oldProduct && oldProduct.images) {
            for (const oldImage of oldProduct.images) {
                await supabase.storage.from('click2eat').remove([oldImage]);
            }
        }

        // Subir nuevas imágenes
        for (const image of images) {
            const uid = crypto.randomUUID()
            const imagePath = `${user.user_metadata.current_session}/products/${uid}`;
            const { data, error } = await supabase.storage.from('click2eat').upload(imagePath, image);
            if (error) {
                console.error(error);
                continue;
            }
            imagesUid.push(imagePath);
        }

        // Actualizar las imágenes del producto
        const { error: updateProductImageError } = await supabase
            .from('products')
            .update({ images: imagesUid })
            .eq('id', productId);

        if (updateProductImageError) {
            console.error(updateProductImageError);
        }
    }

    return updatedProduct[0];
}

export async function productById(productId: string): Promise<any> {
    const {supabase} = await getUser()
    const {data, error} = await supabase.from('products').select().eq('id', productId).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('Product not found');
    return data;
}