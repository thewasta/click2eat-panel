'use client'

import {Button} from "@/components/ui/button";
import {useQuery} from "@tanstack/react-query";
import {retrieveCategories} from "@/_request/product/category.service";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {createElement, memo, useState} from "react";
import {CreateCategoryForm} from "@/app/(dashboard)/products/categories/createCategoryForm";
import {CategoryItem} from "@/app/(dashboard)/products/categories/categoryItem";
import {CreateSubCategoryForm} from "@/app/(dashboard)/products/categories/createSubCategoryForm";
import {Tables} from "@/types/database/database";
import {LoadingSkeleton} from "@/app/(dashboard)/products/categories/loadingSkeleton";

type SheetContentType = 'category' | 'subCategory';

type SheetStateForm = {
    type: SheetContentType;
    category?: Tables<'categories'>
    subCategory?: Tables<'sub_categories'>
}

type SheetContentMap = {
    [K in SheetContentType]: React.ComponentType<any>;
};

export default function ProductCategoriesPage() {

    const {data: categories, isLoading} = useQuery({
        queryKey: ["categories"],
        queryFn: async () => retrieveCategories(),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchOnWindowFocus: false
    });

    const [sheetContent, setSheetContent] = useState<SheetStateForm | null>(null)
    const handleSheetContent = (content: SheetContentType) => {
        setSheetContent({
            type: content
        });
    }
    const sheetContentMap: SheetContentMap = {
        category: CreateCategoryForm,
        subCategory: CreateSubCategoryForm,
    };
    const MemorizedCategoryItem = memo(CategoryItem);

    return (
        <Sheet>
            <SheetTrigger asChild className={'mb-2'}>
                <Button onClick={() => handleSheetContent('category')}>
                    Crear Categoría
                </Button>
            </SheetTrigger>
            <div className={'flex-1 w-full md:w-1/2'}>
                {
                    isLoading &&
                    <LoadingSkeleton/>
                }
                {
                    categories &&
                    categories.map((category) => (
                        <MemorizedCategoryItem key={category.id} category={category}
                                               handleSheetContent={setSheetContent}/>
                    ))
                }
            </div>
            <SheetContent>
                {sheetContent && sheetContentMap[sheetContent.type] &&
                    createElement(sheetContentMap[sheetContent.type],
                        sheetContent.type === 'subCategory' ? {categoryId: sheetContent.category?.id} : null
                    )
                }
            </SheetContent>
        </Sheet>
    );
}