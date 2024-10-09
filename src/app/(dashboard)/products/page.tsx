"use client"
import {getProductColumns} from "@/components/ui/colums";
import {ProductTable} from "@/components/products/product-table";
import {useCallback, useEffect, useState} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Tables} from "@/types/database/database";
import useDebounce from "@/_lib/_hooks/useDebounce";
import {useDeleteProduct} from "@/lib/hooks/mutations/useProductMutation";
import {useGetProducts} from "@/lib/hooks/query/useProduct";

export default function ProductsPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState<string>()
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const {data, error, isLoading} = useGetProducts({
        page,
        pageSize,
        sortBy,
        sortOrder,
        searchTerm: debouncedSearchTerm
    });

    const {mutate: deleteProduct} = useDeleteProduct();

    const onDelete = useCallback((product: Tables<'products'>) => {
        deleteProduct(product.id);
    }, [deleteProduct]);

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