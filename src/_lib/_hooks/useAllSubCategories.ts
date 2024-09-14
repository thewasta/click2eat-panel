import { useMemo } from 'react';
import { Tables } from "@/types/database/database";

type SubCategory = Tables<'sub_categories'>
type CategoryWithSubCategories = Tables<'categories'> & {
    sub_categories: SubCategory[]
}

export const useAllSubcategories = (categories: CategoryWithSubCategories[] | undefined) => {
    return useMemo(() => {
        if (!categories) return [];
        const subcategorySet = new Set<Tables<'sub_categories'>>();
        categories.forEach(category => {
            (category.sub_categories || []).forEach(subCategory => {
                const existingSubCategory = Array.from(subcategorySet).find(s => s.id === subCategory.id);
                if (!existingSubCategory) {
                    subcategorySet.add(subCategory);
                }
            });
        });
        return Array.from(subcategorySet);
    }, [categories]);
};