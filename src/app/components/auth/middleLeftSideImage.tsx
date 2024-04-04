import Image from "next/image";

export default function MiddleLeftSideImage() {
    return (
        <div className="sm:w-1/2 hidden relative h-full sm:flex flex-col">
            <div className="absolute hidden md:flex top-[20%] left-[10%] flex-col">
                <h1 className="text-4xl text-white font-extrabold my-4">
                    Click2Eat
                </h1>
                <p className="text-xl text-white font-normal">
                    Sistema gestión para tu negocio
                </p>

            </div>
            <Image
                src="https://placehold.co/750x800"
                alt=""
                width={750}
                height={800}
                className="w-full h-full object-cover"
            />
        </div>
    );
}