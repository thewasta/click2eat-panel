'use server'

import {getUser} from "@/_lib/_hooks/useUser";
import {ResponseResult} from "@/lib/types/ResponseResult";
import * as Sentry from '@sentry/nextjs';
import {Tables} from "@/types/database/database";

type LocationsProps = {
    page: number,
    pageSize: number
}

export async function retrieveLocations({
                                            page,
                                            pageSize
                                        }: LocationsProps): Promise<ResponseResult<{
    locations: Tables<'establishment_table_location'>[];
    totalCount: number
}>> {
    const {supabase} = await getUser();
    const offset = (page - 1) * pageSize;

    const query = supabase.from("establishment_table_location").select('*', {count: 'exact'});
    const {data, error, count} = await query.range(offset, offset + pageSize - 1);
    if (error) {
        Sentry.captureException(error)
        return {
            success: false,
            error: 'Unable to find locations'
        }
    }
    return {
        success: true,
        data: {
            locations: data,
            totalCount: count || 0
        }
    }
}

type EstablishmentTablesWithLocation = Tables<'establishment_tables'> & {
    establishment_table_location: {
        id: string;
        name: string;
    }
}

type TablesProps = {
    page: number;
    pageSize: number;
}

export async function retrieveTables({page, pageSize}: TablesProps): Promise<ResponseResult<{
    tables: EstablishmentTablesWithLocation[];
    totalCount: number
}>> {
    const {supabase} = await getUser();
    const offset = (page - 1) * pageSize;
    const query = supabase.from("establishment_tables").select('*,establishment_table_location(id,name)', {count: 'exact'});
    const {data, error, count} = await query.range(offset, offset + pageSize - 1)
    if (error) {
        Sentry.captureException(error, {
            level: "error"
        });
        return {
            success: false,
            error: 'Unable to find tables',
        }
    }

    return {
        success: true,
        data: {
            tables: data,
            totalCount: count || 0
        }
    }
}