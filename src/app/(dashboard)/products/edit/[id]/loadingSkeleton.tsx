import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => {
    return (
        <div className="space-y-6 w-full">
            {/* Destacado */}
            <div className="p-4 space-y-2 border rounded-lg">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-end">
                    <Skeleton className="h-6 w-10" />
                </div>
            </div>

            {/* Nombre, Programar publicación, Precio, Estado */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>

            {/* Oferta, Categoría, Sub Categoría */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
            </div>

            {/* Descripción e Ingredientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-32" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-10" />
                </div>
            </div>

            {/* Imagen */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-10" />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
};