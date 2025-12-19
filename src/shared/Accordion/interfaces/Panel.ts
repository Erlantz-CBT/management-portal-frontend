/**
 * Accordion Panel interface
 */

interface PanelAction {
    icon: string
    onClick?: any
}

export interface Panel {
    /**
     * Panel Header
     */
    header: string
    /**
     * (OP)Panel subtitle
     */
    subtitle?: string
    /**
     * Panel content
     */
    content: string
    /**
     * Panel Metadata
     */
    metadata: object[]
    /**
     * (OP) Panel actions
     */
    actions: PanelAction[]
    /**
     * (OP) Expanded flag
     */
    expanded?: boolean | number | boolean[]
    /**
     * Hidden content
     */
    hidden: string | string[] | object[]
}