import React from "react";

interface Props {
    children: React.ReactNode;
    customClass?: string;
}

export default function MiddleRightSide({children,customClass}: Props) {
    return (
        <div className={`sm:w-3/4 md:w-2/3 lg:w-1/2 w-full h-full bg-[#F5F5F5] flex flex-col p-20 ${customClass || ''}`}>
            {children}
        </div>
    );
}