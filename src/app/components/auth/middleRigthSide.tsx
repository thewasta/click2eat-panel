import React from "react";

interface Props {
    children: React.ReactNode;
}

export default function MiddleRightSide({children}: Props) {
    return (
        <div className="sm:w-3/4 md:w-1/2 w-full h-full bg-[#F5F5F5] flex flex-col p-20 justify-between">
            {children}
        </div>
    );
}