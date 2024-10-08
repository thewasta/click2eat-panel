import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    createCategory,
    deleteCategoryById,
    editSubCategory,
    retrieveCategories
} from "@/app/actions/dashboard/category.service";
import {toast} from "sonner";
import {Tables} from "@/types/database/database";
import {UseFormReturn} from "react-hook-form";

type SubCategory = Tables<'sub_categories'>

type CategoryWithSubCategories = Tables<'categories'> & {
    sub_categories: SubCategory[]
}

export function useGetCategories() {
    const {data, error, status} = useQuery({
        queryKey: ["categories"],
        queryFn: async () => retrieveCategories(),
    });

    return {
        data,
        error,
        isLoading: status === "pending",
    }
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    const {mutate, mutateAsync, status, data} = useMutation({
        mutationFn: deleteCategoryById,
        mutationKey: ['delete_category'],
        onMutate: async (deletedCategoryId) => {
            await queryClient.cancelQueries({queryKey: ['categories']});

            const previousCategories = queryClient.getQueryData(['categories']);

            queryClient.setQueryData(['categories'], (old: CategoryWithSubCategories[]) => {
                if (!old) return [];
                return old.filter(category => category.id !== deletedCategoryId);
            });

            return {previousCategories};
        },
        onSuccess: () => {
            toast.success('Categoría borrada correctamente');
        },
        onError: (_err, _deletedProductId, context) => {
            queryClient.setQueryData(['products'], context?.previousCategories);
            toast.warning('Ha falllado el borrado', {
                description: 'Por favor, si el problema persiste contacta con nosotros.'
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
        }
    });
    return {mutate, mutateAsync, status, data};
}

export function useCreateCategory({form}: { form: UseFormReturn<any> }) {
    const queryClient = useQueryClient();

    const {mutate, data, error, status} = useMutation({
        mutationFn: createCategory,
        mutationKey: ["create_category"],
        onMutate: async (newSubCategory) => {
            await queryClient.cancelQueries({queryKey: ['categories']});

            const previousCategories = queryClient.getQueryData<CategoryWithSubCategories[]>(['categories']);

            queryClient.setQueryData(['categories'], (old: CategoryWithSubCategories[]) => {
                if (!old) return [];

                return [...old, newSubCategory];
            });

            return {previousCategories};
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
            toast.success('Categoría creada');
            form.reset();
        },
        onError: (_error, _variables, context) => {
            queryClient.setQueryData(["categories"], context?.previousCategories)
            toast.error('Categoría no creada', {
                description: 'Ha ocurrido un error al crear la categoría.',
            });
        },
    });
    return {
        data,
        error,
        mutate,
        status
    }
}

export function useUpdateCategory({form}: { form: UseFormReturn<any> }) {
    const queryClient = useQueryClient();

    const {mutate, error, status, data} = useMutation({
        mutationFn: editSubCategory,
        onSuccess: () => {
            queryClient
                .invalidateQueries({
                    queryKey: ["categories"]
                });
            toast.success('Sub categoría editada');
            form.reset();
        },
        onError: () => {
            queryClient
                .invalidateQueries({
                    queryKey: ["categories"]
                });
            toast.error('Error al editar', {
                description: 'Ha ocurrido un error al editar la sub categoría.',
            });
        },
    });
    return {
        data,
        mutate,
        status,
        error,
    }
}