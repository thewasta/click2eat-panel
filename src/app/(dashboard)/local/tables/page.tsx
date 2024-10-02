import {TablesLocalization} from "@/app/(dashboard)/local/tables/TablesLocalization";
import {TablesDinnerTable} from "@/app/(dashboard)/local/tables/TablesDinnerTable";

export default function LocalTablesPage() {
    return (
        <div className={"container mx-auto space-y-3"}>
            <TablesLocalization/>
            <TablesDinnerTable/>
        </div>
    )

}