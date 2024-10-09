import {useQuery} from "@tanstack/react-query";
import {retrieveLocations} from "@/app/actions/dashboard/tables.service";

export function useGetDinnerLocation({page, pageSize, filterStatus, searchTerm}: {
    page: number;
    pageSize: number;
    filterStatus?: string;
    searchTerm?: string;
}) {
    const {data, status} = useQuery({
        queryKey: ['tables_locations', page, pageSize, filterStatus, searchTerm],
        queryFn: async () => retrieveLocations({page, pageSize: pageSize, searchTerm, filterStatus}),
    });
    return {
        data,
        isLoading: status === "pending",
    }
}