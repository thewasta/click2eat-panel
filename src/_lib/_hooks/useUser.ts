import {createClient} from "@/_lib/supabase/server";
import {User} from "@supabase/auth-js";
import {SupabaseClient} from "@supabase/supabase-js";

type getUserReturnType = {
    user: Customer,
    supabase: SupabaseClient
}

interface CustomerMetadata {
    current_session: string
}

type Customer = Omit<User, 'user_metadata'> & {
    user_metadata: CustomerMetadata;
}

export async function getUser(): Promise<getUserReturnType> {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();

    if (authError || !user || !user.user_metadata.current_session) {
        throw new Error('Invalid session');
    }

    return {
        user: user as Customer,
        supabase
    };
}