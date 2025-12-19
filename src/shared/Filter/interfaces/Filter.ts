interface FilterOption {
    key: string
    value: string
}

export interface Filter {
    key: keyof object
    value?: any
    label: string
    type: string // 'text', 'select', 'date', 'range'
    caseSensitive?: boolean // 'text' type support case sensitive
    /**
     * (OP) In case of a select filter, supply an array of fields
     */
    options?: FilterOption[]
    /**
     * (OP) Apply a custom condition to the filter ((x, y) => x === y.field)
     */
    customCondition?: boolean
}