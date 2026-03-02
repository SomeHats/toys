import {
    DefaultToolbar,
    EraserToolbarItem,
    HandToolbarItem,
    SelectToolbarItem,
    ToolbarItem,
} from "tldraw";

export function Toolbar() {
    return (
        <DefaultToolbar>
            <SelectToolbarItem />
            <HandToolbarItem />
            <EraserToolbarItem />
            <ToolbarItem tool="tx-box" />
        </DefaultToolbar>
    );
}
