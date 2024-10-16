import {useQuery} from "@tanstack/react-query";
import {retrieveTables} from "@/app/actions/dashboard/tables.service";

interface UseGetTableDinner {
    page?: number;
    pageSize?: number;
    filterStatus: string | null;
    filterLocation: string | null;
    searchTerm: string | null;
}

export function useGetTableDinner({
                                      page,
                                      pageSize,
                                      filterStatus,
                                      filterLocation,
                                      searchTerm,
                                  }: UseGetTableDinner) {

    const {data, status} = useQuery({
        queryKey: ['tables', page, filterStatus, filterLocation, searchTerm],
        queryFn: async () => retrieveTables({
            page,
            pageSize,
            filterBy: {
                location: filterLocation,
                status: filterStatus,
                term: searchTerm
            }
        })
    });

    return {
        data,
        isLoading: status === "pending",
    }
}