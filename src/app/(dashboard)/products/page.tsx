"use client"
import {getProductColumns} from "@/components/ui/colums";
import {ProductTable} from "@/components/products/product-table";
import {useCallback, useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {productRetriever, removeProduct} from "@/app/actions/dashboard/product.service";
import {toast} from "sonner";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Tables} from "@/types/database/database";
import useDebounce from "@/_lib/_hooks/useDebounce";

export default function ProductsPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState<string>()
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const {data, error, isLoading} = useQuery<{
        products: Tables<'products'>[],
        totalCount: number
    }>({
        queryKey: ["products", page, pageSize, sortBy, sortOrder, debouncedSearchTerm],
        queryFn: async () => productRetriever({page, pageSize, sortBy, sortOrder, searchTerm: debouncedSearchTerm}),
        retry: false,
        refetchOnWindowFocus: 'always',
        refetchOnReconnect: true,
        staleTime: 60000 * 3,
        refetchOnMount: false,
        refetchIntervalInBackground: false
    });

    const deleteMutation = useMutation({
        mutationFn: removeProduct,
        onMutate: async (deletedProductId) => {
            await queryClient.cancelQueries({ queryKey: ['products'] });

            const previousProducts = queryClient.getQueryData<{
                products: Tables<'products'>[],
                totalCount: number
            }>(['products']);

            queryClient.setQueryData<{
                products: Tables<'products'>[],
                totalCount: number
            }>(['products'], old => {
                if (!old) return { products: [], totalCount: 0 };
                return {
                    products: old.products.filter(product => product.id !== deletedProductId),
                    totalCount: old.totalCount - 1
                };
            });

            return { previousProducts };
        },
        onSuccess: () => {
            toast.success("Product eliminado correctamente");
        },
        onError: () => {
            toast.error("No se ha podido eliminar el producto");
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['products']});
        }
    });

    const onDelete = useCallback((product: Tables<'products'>) => {
        deleteMutation.mutate(product.id);
    }, []);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }

    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(currentOrder => currentOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
        setPage(1)
    }
    const columns = getProductColumns({onDelete, onSort: handleSort, sortBy, sortOrder});
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };
    return (
        <div className={'p-1'}>
            <ProductTable
                columns={columns}
                data={data?.products || []}
                isLoading={isLoading}
                entityName={'Producto'}
                searchBy={'name'}
                buttonAction={(<Button asChild>
                    <Link href={'/products/create'}>
                        Crear producto
                    </Link>
                </Button>)}
                pagination={{
                    currentPage: page,
                    totalPages: Math.ceil((data?.totalCount || 0) / pageSize),
                    onPageChange: handlePageChange
                }}
                sorting={{
                    sortBy,
                    sortOrder,
                    onSort: handleSort
                }}
                onSearch={handleSearch}
            />
        </div>
    );
}