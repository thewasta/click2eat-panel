'use server'
import {createClient} from "@/_lib/supabase/server";
import {Tables} from "@/types/database/database";
import {TypedFormData} from "@/_lib/_hooks/useFormData";
import {CategorySchemaDTO} from "@/app/(dashboard)/products/categories/createCategoryForm";

type CategoryStatus = "DRAFT" | "PUBLISHED" | "DISCONTINUED";

export async function createCategory(formData: TypedFormData<CategorySchemaDTO>): Promise<void> {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();

    if (authError || !user || !user.user_metadata.current_session) {
        throw new Error('Invalid session');
    }

    const status = formData.get('status') as CategoryStatus;

    const {data, error} = await supabase.from('categories').insert({
        business_establishment_id: user.user_metadata.current_session,
        status: status,
        name: formData.get('name') as string
    })
    if (error) {
        console.error(error);
        throw new Error('No ha sido posible crear la categoría');
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
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Invalid Sessión');
    }

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
        console.log({categoryError})
        throw new Error(categoryError.message);
    }

    return processCategories(categories as RawCategoryData[]);
}


export async function categoryById() {

}

export async function updateCategoryById() {

}

export async function deleteCategoryById(categoryId: string): Promise<void> {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Invalid session');
    }
    const {data, error} = await supabase.from('categories')
        .delete()
        .eq('id', categoryId);
    if (error) {
        throw new Error('No ha podido borrar la categoría');
    }
}