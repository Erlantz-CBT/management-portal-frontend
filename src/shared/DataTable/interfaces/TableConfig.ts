interface TableColumnsWidths {
    /**
     * Array of width value for the table columns
     * if no value are provided, there will be applied an 'auto' width
     */
    columnWidth: Array<string>
}

interface Pagination {
    items?: number;
    pages?: number;
}

export interface TableConfig {
    tableStyle?: any;
    // Deprecated: Columns widths moved inside each column definition
    style?: TableColumnsWidths;
    pagination?: Pagination;
    sized?: boolean;
    // Prototype: Table with this parameter will have a transition on pagination change
    animated?: boolean;
}