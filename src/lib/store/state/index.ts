import {useQuery, useQueryClient} from "@tanstack/react-query";
import {Tables} from "@/types/database/database";
import {retrieve} from "@/app/actions/business/business.service";

export function createGlobalState<T>(queryKey: unknown, queryFn: () => Promise<T>) {
    return function () {
        const queryClient = useQueryClient();

        const {data} = useQuery({
            queryKey: [queryKey],
            queryFn: async () => queryFn(),
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchInterval: false,
            refetchOnReconnect: false,
            refetchIntervalInBackground: false,
            staleTime: Infinity
        });

        function setData(data: Partial<T>) {
            queryClient.setQueryData([queryKey], data);
        }

        function resetData() {
            queryClient.invalidateQueries({
                queryKey: [queryKey]
            });
            queryClient.refetchQueries({
                queryKey: [queryKey]
            });
        }

        return {data, setData, resetData};
    }
}

export const useGlobalState = createGlobalState<Tables<'business'>>('dashboard', retrieve);