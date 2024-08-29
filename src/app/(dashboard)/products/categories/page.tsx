'use client'

import {Button} from "@/components/ui/button";
import {useQuery} from "@tanstack/react-query";
import {retrieveCategories} from "@/_request/product/category.service";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Skeleton} from "@/components/ui/skeleton";
import {memo, useState} from "react";
import {CreateCategoryForm} from "@/app/(dashboard)/products/categories/createCategoryForm";
import {CategoryItem} from "@/app/(dashboard)/products/categories/categoryItem";
import {CreateSubCategoryForm} from "@/app/(dashboard)/products/categories/createSubCategoryForm";
import {Tables} from "@/types/database/database";
import {LoadingSkeleton} from "@/app/(dashboard)/products/categories/loadingSkeleton";

type SheetStateForm = {
    type: string;
    category?: Tables<'categories'>
    subCategory?: Tables<'sub_categories'>
}
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
    const handleSheetContent = (content: string) => {
        setSheetContent({
            type: content
        });
    }
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
                        <MemorizedCategoryItem key={category.id} category={category} handleSheetContent={setSheetContent}/>
                    ))
                }
            </div>
            <SheetContent>
                {
                    sheetContent?.type === 'category' &&
                    (
                        <>
                            <SheetHeader>
                                <SheetTitle>
                                    Creación de Categoría
                                </SheetTitle>
                                <SheetDescription>
                                    Crea una nueva categoría
                                </SheetDescription>
                            </SheetHeader>
                            <CreateCategoryForm/>
                        </>
                    )
                }
                {
                    sheetContent?.type === 'subCategory' &&
                    (
                        <CreateSubCategoryForm categoryId={sheetContent.category?.id!}/>
                    )
                }
            </SheetContent>
        </Sheet>
    );
}