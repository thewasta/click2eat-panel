'use server'

import {getUser} from "@/_lib/_hooks/useUser";
import {ResponseResult} from "@/lib/types/ResponseResult";
import * as Sentry from '@sentry/nextjs';
import {Tables} from "@/types/database/database";

type LocationsProps = {
    page: number;
    pageSize: number;
    filterStatus?: string;
    searchTerm?: string;
}

export async function retrieveLocations({
                                            page,
                                            pageSize,
                                            filterStatus,
                                            searchTerm,
                                        }: LocationsProps): Promise<ResponseResult<{
    locations: Tables<'establishment_table_location'>[];
    totalCount: number
}>> {
    const {supabase} = await getUser();
    const offset = (page - 1) * pageSize;

    const query = supabase.from("establishment_table_location").select('*', {count: 'exact'});

    if (filterStatus && filterStatus.length > 4) {
        query.eq('status', filterStatus.toUpperCase());
    }

    if (searchTerm && searchTerm.length > 1) {
        console.log({
            ilike: `%${searchTerm}%`
        })
        query.ilike('name', `%${searchTerm}%`);
    }

    const {data, error, count} = await query.range(offset, offset + pageSize - 1);
    if (error) {
        console.error(error);
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
    filterBy?: {
        location: string | null;
        term: string | null;
        status: string | null;
    }
}

export async function retrieveTables({page, pageSize, filterBy}: TablesProps): Promise<ResponseResult<{
    tables: EstablishmentTablesWithLocation[];
    totalCount: number
}>> {
    const {supabase} = await getUser();
    const offset = (page - 1) * pageSize;
    const query = supabase.from("establishment_tables").select('*,establishment_table_location(id,name)', {count: 'exact'});
    if (filterBy) {
        if (filterBy.location) {
            query.eq('location_id', filterBy.location);
        }
        if (filterBy.term) {
            query.ilike('name', `%${filterBy.term}%`);
        }
        if (filterBy.status) {
            query.eq('status', filterBy.status.toUpperCase());
        }
    }
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

type CreateLocationProp = {
    locationName: string;
    locationStatus?: string;
}

export async function createLocation({
                                         locationName,
                                         locationStatus
                                     }: CreateLocationProp): Promise<ResponseResult<null>> {
    const {user, supabase} = await getUser();

    const {data, error} = await supabase.from('establishment_table_location').insert({
        establishment_id: user.user_metadata.current_session,
        name: locationName,
        status: locationStatus ? locationStatus.toUpperCase() : undefined
    });
    if (error) {
        return {
            success: false,
            error: error.message
        }
    }
    return {
        success: true,
        data: null,
        message: 'OK'
    }
}

export async function deleteLocation({locationId}: { locationId: string }): Promise<ResponseResult<null>> {
    const {supabase} = await getUser();
    const {data, error} = await supabase.from('establishment_table_location').delete().eq('id', locationId);

    if (error) {
        if (error.details.startsWith('Key is still referenced from table')) {
            return {
                success: false,
                error: 'Please remove tables from this location',
            }
        }
        return {
            success: false,
            error: error.message
        }
    }

    return {
        success: true,
        data: null,
        message: 'OK'
    }
}

export async function updateLocation({locationId, name, status}: {
    locationId: string;
    name: string;
    status: string;
}): Promise<ResponseResult<null>> {

    const {supabase} = await getUser();
    const {error} = await supabase.from('establishment_table_location').update({
        name: name,
        status: status.toUpperCase(),
    }).eq('id', locationId);

    if (error) {
        console.error(error);
        return {
            success: false,
            error: error.message
        }
    }
    return {
        success: true,
        data: null,
        message: 'OK'
    }
}

export async function deleteTable({tableId}: { tableId: string }): Promise<ResponseResult<null>> {
    const {supabase} = await getUser()
    const {error} = await supabase.from('establishment_tables').delete().eq('id', tableId)
    if (error) {
        console.error(error);
        return {
            success: false,
            error: error.message
        }
    }
    return {
        success: true,
        data: null
    }
}

export async function updateTable({tableId, name, status, locationId}: {
    tableId: string;
    name: string;
    status: string;
    locationId: string
}): Promise<ResponseResult<null>> {
    const {supabase} = await getUser()
    const {data, error} = await supabase.from('establishment_tables').update({
        name,
        status: status.toUpperCase(),
        location_id: locationId
    }).eq('id', tableId);

    if (error) {
        return {
            success: false,
            error: error.message
        }
    }
    return {
        success: true,
        data: null
    }
}

export async function createTable({name, status, locationId}: {
    name: string;
    status?: string;
    locationId: string
}): Promise<ResponseResult<null>> {
    const {supabase, user} = await getUser();

    const {error} = await supabase.from('establishment_tables').insert({
        name,
        ...(status ? {status: status.toUpperCase()} : {}),
        location_id: locationId,
        establishment_id: user.user_metadata.current_session
    });

    if (error) {
        console.error(error);
        return {
            success: false,
            error: error.message
        }
    }

    return {
        success: true,
        data: null,
        message: 'Table dinner created successfully'
    }
}