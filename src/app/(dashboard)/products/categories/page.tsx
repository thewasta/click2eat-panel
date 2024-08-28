'use client'

import {Button} from "@/components/ui/button";
import {useQuery} from "@tanstack/react-query";
import {retrieveCategories} from "@/_request/product/category.service";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Skeleton} from "@/components/ui/skeleton";
import {useState} from "react";
import {CreateCategoryForm} from "@/app/(dashboard)/products/categories/createCategoryForm";

import {CategoryItem} from "@/app/(dashboard)/products/categories/categoryItem";

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

    const [sheetContent, setSheetContent] = useState<string | null>(null)
    const handleSheetContent = (content: string) => {
        setSheetContent(content);
    }
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
                    Array.from({length: 3}).map((_, index) => (
                        <div key={index} className="space-y-4 mb-3">
                            <Skeleton className="h-6 w-1/2"/>
                            <Skeleton className="h-4 w-3/4"/>
                            <Skeleton className="h-8 w-full"/>
                        </div>
                    ))
                }
                {
                    categories &&
                    categories.map((category) => (
                        <CategoryItem key={category.id} category={category} handleSheetContent={setSheetContent}/>
                    ))
                }
            </div>
            <SheetContent>
                {
                    sheetContent === 'category' &&
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
                    sheetContent === 'subCategory' &&
                    (
                        <>
                            <SheetHeader>
                                <SheetTitle>
                                    Creación de sub categoría
                                </SheetTitle>
                                <SheetDescription>
                                    Crea una nueva categoría
                                </SheetDescription>
                            </SheetHeader>
                        </>
                    )
                }
            </SheetContent>
        </Sheet>
    );
}