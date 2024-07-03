import {createClient} from "@/lib/supabase/server";
import ShopNameComponent from "@/app/dashboard/components/shopNameComponent";

export default async function HomeDashboard() {
    // const responsiveBreakpoint: string = "sm:bg-indigo-500 md:bg-red-600 lg:bg-green-300 xl:bg-blue-600 2xl:bg-red-800 bg-violet-600";
    const client = createClient();
    const {data: {user}} = await client.auth.getUser();

    return (
        <div className="col-span-2">
                        <span className="font-bold text-xl">
                            Buenos días, {user?.user_metadata.full_name}.
                        </span>

            <p className="text-gray-500 text-sm">
                Esto es lo que está sucediendo hoy en <ShopNameComponent/>

            </p>
            <div className="grid grid-cols-3">
            </div>
        </div>
    )
}