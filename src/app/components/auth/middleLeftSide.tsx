import React from "react";

interface Props {
    children: React.ReactNode;
}

export default function MiddleLeftSide({children}: Props) {
    return (
        <div className="sm:w-1/2 hidden relative h-full sm:flex flex-col">
            {children}
        </div>
    );
}