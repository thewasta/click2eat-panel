import React from "react";

interface Props {
    children: React.ReactNode;
}

export default function MiddleLeftSide({children}: Props) {
    return (
        <div className="w-1/2 md:w-2/3 lg:w-1/2 hidden relative h-full sm:flex flex-col bg-slate-100">
            {children}
        </div>
    );
}