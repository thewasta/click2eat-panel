import {createClient} from "@/lib/supabase/client";

export default function HomeDashboard() {
    // const responsiveBreakpoint: string = "sm:bg-indigo-500 md:bg-red-600 lg:bg-green-300 xl:bg-blue-600 2xl:bg-red-800 bg-violet-600";
    const client = createClient();
    const categories = null; //await client.from('product').select('*,category(*),sub_category(*)');

    return (
        <>
            <div className="col-span-2">
                        <span className="font-bold text-xl">
                            Buenos días, [].
                        </span>
                <p className="text-gray-500 text-sm">
                    Esto es lo que está sucediendo hoy en <span className="underline">[Nombre tienda]</span>
                </p>
                <div className="grid grid-cols-3">
                    {
                        JSON.stringify(categories,null,2)
                    }
                </div>
            </div>
        </>
    )
}