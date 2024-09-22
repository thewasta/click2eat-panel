'use server'

import {Tables} from "@/types/database/database";
import {TypedFormData} from "@/_lib/_hooks/useFormData";
import {CategorySchemaDTO} from "@/app/(dashboard)/products/categories/createCategoryForm";
import {SubCategoryDTO} from "@/app/(dashboard)/products/categories/createSubCategoryForm";
import {getUser} from "@/_lib/_hooks/useUser";

type CategoryStatus = "DRAFT" | "PUBLISHED" | "DISCONTINUED";

export async function createCategory(formData: TypedFormData<CategorySchemaDTO>): Promise<void> {
    const {user, supabase} = await getUser();

    const status = formData.get('status') as CategoryStatus;

    const {error} = await supabase.from('categories').insert({
        business_establishment_id: user.user_metadata.current_session,
        status: status,
        name: formData.get('name') as string
    })
    if (error) {
        throw new Error('No ha sido posible crear la categoría');
    }
}

export async function editCategory(formData: TypedFormData<CategorySchemaDTO>): Promise<void> {
    const {supabase} = await getUser();
    const status = formData.get('status') as CategoryStatus;

    const {error} = await supabase.from('categories')
        .update({
            status: status,
            name: formData.get('name') as string
        })
        .eq('id', formData.get('id')).select();
    if (error) {
        console.error(error);
        throw new Error('No fue posible actualizar la categoría');
    }
}

type SubCategory = Tables<'sub_categories'>

type CategoryWithSubCategories = Tables<'categories'> & {
    sub_categories: SubCategory[]
}

type RawCategoryData = Tables<'categories'> & {
    sub_categories: {
        sub_category: SubCategory;
    }[];
};

function processCategories(rawData: RawCategoryData[]): CategoryWithSubCategories[] {
    return rawData.map(category => ({
        ...category,
        sub_categories: category.sub_categories.map(sc => sc.sub_category)
    }));
}

export async function retrieveCategories(): Promise<CategoryWithSubCategories[]> {
    const {user, supabase} = await getUser();

    const currentBusiness = user.user_metadata.current_session;
    const {
        data: categories,
        error: categoryError
    } = await supabase.from('categories')
        .select(`
      *,
      sub_categories:category_subcategories(
        sub_category:sub_categories(
          *
        )
      )
    `)
        .eq('business_establishment_id', currentBusiness);
    if (categoryError) {
        throw new Error(categoryError.message);
    }

    return processCategories(categories as RawCategoryData[]);
}


export async function categoryById() {

}

export async function updateCategoryById() {

}

export async function deleteCategoryById(categoryId: string): Promise<void> {
    const {supabase} = await getUser();

    const {error: errorRemovePivot} = await supabase.from('category_subcategories')
        .delete()
        .eq('category_id', categoryId);

    if (errorRemovePivot) {
        throw new Error('Ha ocurrido un error al eliminar la categoría');
    }

    const {error} = await supabase.from('categories')
        .delete()
        .eq('id', categoryId);
    if (error) {
        console.error(error);
        throw new Error('Ha ocurrido un error al eliminar la categoría');
    }
}

export async function addSubCategoryToCategory({
                                                   subCategoryId, categoryId
                                               }: {
    subCategoryId: string;
    categoryId: string
}): Promise<void> {
    const {supabase} = await getUser();
    const {error} = await supabase.from('category_subcategories').insert({
        subcategory_id: subCategoryId,
        category_id: categoryId
    });
    if (error) {
        console.error(error);
        throw new Error('No ha sido posible añadir la sub categoría');
    }
}

type DeleteSubCategoryById = {
    subCategoryId: string;
    categoryId: string;
}

export async function deleteSubCategoryById({subCategoryId, categoryId}: DeleteSubCategoryById): Promise<void> {
    const {supabase} = await getUser();

    const {data: subCategoriesPivot, error: subCategoriesError} = await supabase.from('category_subcategories')
        .select()
        .eq('subcategory_id', subCategoryId);

    if (subCategoriesError || !subCategoriesPivot) {
        throw new Error('No ha sido posible borrar la sub categoría');
    }
    try {
        if (subCategoriesPivot.length === 1) {
            await supabase.from('sub_categories').delete().eq('id', subCategoryId);
        }
        await supabase.from('category_subcategories')
            .delete()
            .eq('category_id', categoryId)
            .eq('subcategory_id', subCategoryId);

    } catch (e) {
        throw new Error('No ha sido posible borrar la sub categoría.')
    }
}

export async function createSubCategory(formData: TypedFormData<SubCategoryDTO>): Promise<void> {
    const {user, supabase} = await getUser();

    const {data, error} = await supabase.from('sub_categories').insert({
        business_establishment_id: user.user_metadata.current_session,
        status: formData.get("status") as CategoryStatus,
        name: formData.get('name') as string,
    }).select().single();

    if (error) {
        throw new Error('No ha sido posible crear la sub categoría')
    }

    const {error: pivotError} = await supabase.from('category_subcategories').insert({
        category_id: formData.get('categoryId') as string,
        subcategory_id: data.id
    });

    if (pivotError) {
        throw new Error('No ha sido posible crear la relación')
    }

}

export async function editSubCategory(formData: TypedFormData<SubCategoryDTO>): Promise<void> {
    const {supabase} = await getUser();

    const {error} = await supabase.from('sub_categories')
        .update({
            status: formData.get("status") as CategoryStatus,
            name: formData.get('name') as string,
        })
        .eq('id', formData.get('id'))

    if (error) {
        console.error(error);
        throw new Error('No ha sido posible editar la sub categoría');
    }
}