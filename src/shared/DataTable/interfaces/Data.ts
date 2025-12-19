import {Column} from "@/shared/DataTable/interfaces/Column";
import {TableConfig} from "@/shared/DataTable/interfaces/TableConfig";

/** Data interface for the table **/
export interface Data {
    /**
     * sortKey: Key for sort function
     * TODO: to be implemented
     */
    sortKey: string;
    /**s
     * columns: Columns of the table
     */
    tableConfig?: TableConfig
    columns: Array<Column>;
    rows: Array<any>;
}