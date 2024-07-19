import {ReactNode} from "react";

interface IDinnerTable {
    number: string;
    total: number
}

export default function DinnerTable({number, total}: IDinnerTable): ReactNode {
    return (
        <div className={"w-[140px] h-[140px] bg-secondary rounded-md px-3 py-2 relative hover:cursor-pointer hover:bg-primary"}>
            <span className={"rounded-full bg-amber-300 h-[8px] w-[8px] absolute right-3"}/>
            <div className={"flex justify-center items-center h-full"}>
                <div className={"flex flex-col text-center"}>
                    <h4 className={"font-bold text-3xl"}>
                        {number}
                    </h4>
                    <span>
                        {total} €
                    </span>
                </div>
            </div>
        </div>
    )
}