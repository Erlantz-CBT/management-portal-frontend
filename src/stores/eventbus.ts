import mitt from "mitt";
import {Emitter, EventType} from "mitt";
import {defineStore} from "pinia";

/**
 * This eventbus provide a global store who delivers events among all
 * the application context
 *
 * Reference on 'mitt' library: https://github.com/developit/mitt
 */
export const useEventBus = defineStore('useEventBus', {
    state: (): Emitter<Record<EventType, unknown>> => mitt(),
})