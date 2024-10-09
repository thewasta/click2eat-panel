import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
    addSubCategoryToCategory,
    createSubCategory,
    deleteSubCategoryById,
    editSubCategory
} from "@/app/actions/dashboard/category.service";
import {toast} from "sonner";
import {UseFormReturn} from "react-hook-form";

export function useDeleteSubCategories() {
    const queryClient = useQueryClient();
    const {mutate, data, status} = useMutation({
        mutationFn: deleteSubCategoryById,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["categories"]});
            toast.success('SubCategoria borrada correctamente')
        },
        onError: () => {
            queryClient.invalidateQueries({queryKey: ["categories"]});
            toast.error('Ha ocurrido un error al eliminar la sub categoría', {
                description: 'Por favor, envíanos un ticket.'
            })
        }
    });
    return {
        mutate,
        data,
        isLoading: status === "pending"
    }
}

export function useAddSubCategory() {
    const queryClient = useQueryClient();

    const {mutate, data, status} = useMutation({
        mutationFn: addSubCategoryToCategory,
        onSuccess: () => {
            toast.success('Añadida correctamente');
        },
        onError: () => {
            toast.error('No ha sido posible añadir sub categoría');
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
        }
    });

    return {
        mutate,
        data,
        isLoading: status === "pending"
    }
}

export function useCreateSubCategory({form}: { form: UseFormReturn<any> }) {
    const queryClient = useQueryClient();

    const {mutate, data, status} = useMutation({
        mutationFn: createSubCategory,
        onSuccess: () => {
            toast.success('Sub categoría creada');
            form.reset();
        },
        onError: () => {
            toast.error('Error al crear', {
                description: 'Ha ocurrido un error al crear la categoría.',
            });
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
        }
    });
    return {
        mutate,
        data,
        isLoading: status === "pending"
    }
}

export function useEditSubCategory({form}: { form: UseFormReturn<any> }) {
    const queryClient = useQueryClient();

    const {mutate, data, status} = useMutation({
        mutationFn: editSubCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
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
        mutate,
        data,
        isLoading: status === "pending"
    }
}