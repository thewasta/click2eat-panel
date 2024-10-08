import {useQuery} from "@tanstack/react-query";
import {retrieveCategories} from "@/app/actions/dashboard/category.service";

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

