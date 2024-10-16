import { ControlsSchema, ControlEntry } from "../../Types";
import { Components } from "../../Components";
export declare abstract class Configurator<T, U extends ControlsSchema> {
    protected abstract _config: U;
    protected _component: T;
    name: string;
    uuid: string;
    get controls(): U;
    constructor(component: T, components: Components, name: string, uuid?: string);
    copyEntry(controlEntry: ControlEntry): ControlEntry;
}
