import Link from "next/link";

async function NotFoundPage() {
    return (
        <div className={"w-full h-screen bg-slate-50 flex flex-col gap-4 justify-center items-center"}>
            <h1 className={"text-3xl font-bold"}>
                Parece que te has perdido.
                <span className={"font-sans text-sm"}>
                Deberías de volver a un lugar seguro
            </span>
            </h1>
            <Link href={"/"} className={"btn"}>
                Volver atrás
            </Link>
        </div>
    )
}

export default NotFoundPage