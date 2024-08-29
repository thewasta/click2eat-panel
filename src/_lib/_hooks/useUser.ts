import {createClient} from "@/_lib/supabase/server";
import {User} from "@supabase/auth-js";
import {SupabaseClient} from "@supabase/supabase-js";

type getUserReturnType = {
    user: User,
    supabase: SupabaseClient
}
export async function getUser(): Promise<getUserReturnType> {
    const supabase = createClient();
    const {data: {user}, error: authError} = await supabase.auth.getUser();

    if (authError || !user || !user.user_metadata.current_session) {
        throw new Error('Invalid session');
    }

    return {
        user,
        supabase
    };
}