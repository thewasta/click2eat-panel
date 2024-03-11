'use client'
import {useRouter} from "next/navigation";


export default function Home() {
    const router = useRouter()
    async function handleSubmit(e: any) {
        e.preventDefault();
        router.push('/dashboard/home')
    }
    return (
        <section className="bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5">
                <div className="sm:w-1/2 px-16">
                    <h2 className="font-bold text-2xl text-[#002D74]">
                        Acceder
                    </h2>
                    <p className="text-sm mt-4 text-[#002D74]">Sí ya tienes cuenta inicia sesión o contáctanos para
                        cualquier duda</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input className="p-2 mt-8 rounded-xl border" type="email" placeholder="mailto@mail.com"/>
                        <div className="relative">
                            <input className="p-2 rounded-xl border w-full"
                                   type="password"
                                   placeholder="**********"/>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-eye-fill absolute top-1/3 right-3" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                <path
                                    d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                            </svg>
                        </div>
                        <button className="bg-[#002D74] rounded text-white py-2" type="submit">
                            Acceder
                        </button>
                    </form>
                    <a href="#" className="mt-10 text-xs border-b py-6">¿Tienes problemas para acceder?</a>
                </div>
                <div className="sm:block hidden w-1/2">
                    <img className="rounded-2xl" src="https://placehold.co/750x800" width={750} height={800} alt=""/>
                </div>
            </div>
        </section>
    );
}
