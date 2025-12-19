/** Single column **/
export interface Column {
    /**
     * label: Label to display in the header
     */
    label: string;
    /**
     * value: Value to display in the row
     */
    value: string;
    /**
     * style (OPTIONAL): style your column ES. {'width': '50%'}
     */
    style?: object
    /**
     * hasActions (OPTIONAL): define if the columns has clickable actions
     */
    hasActions?: boolean
    /**
     * (OP) Sortable function
     */
    sortable?: any
    chip?: any
    /**
     * (OP) pass a format function to display formatted data
     * from this function you can access to:
     * {row (Data row), col (Data column), value (row[column] data to be formatted)}
     */
    format?: any
}