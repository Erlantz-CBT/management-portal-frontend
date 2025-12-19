interface TableColumnsWidths {
    /**
     * Array of width value for the table columns
     * if no value are provided, there will be applied an 'auto' width
     */
    columnWidth: Array<string>
}

export interface TableConfig {
    tableStyle?: any;
    style?: TableColumnsWidths
}