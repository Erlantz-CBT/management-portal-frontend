import {Panel} from "@/shared/Accordion/interfaces/Panel";

/**
 * Accordion interface
 */
export interface Accordion {
    /**
     * Content of the accordion
     */
    panels: Panel[]
    /**
     * (OPTIONAL) Accordion card style
     */
    style?: object
    /**
     * (OPTIONAL)
     */
    autoCollapse?: boolean
}