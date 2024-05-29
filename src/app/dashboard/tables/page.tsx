import DinnerTable from "@/components/table/dinner-table";

export default function TablesPage() {
    return (
        <div className={"grid grid-cols-[repeat(auto-fit,_150px)] gap-3"}>
            <DinnerTable number={"01"} total={103.5}/>
        </div>
    )
}