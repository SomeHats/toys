import { assert } from "@/lib/assert";
import EventEmitter, { Unsubscribe } from "@/lib/EventEmitter";
import { KeyCode } from "@/lib/KeyCode";
import { entries } from "@/lib/utils";

type ActionInfo = {
    downEvent: EventEmitter;
    upEvent: EventEmitter;
    isDown: boolean;
};

export class ButtonMapping<Actions extends string> {
    private readonly keyCodeToAction: ReadonlyMap<KeyCode, Actions>;
    private readonly actionInfo: ReadonlyMap<Actions, ActionInfo>;

    constructor(actionMappings: Record<Actions, Array<KeyCode>>) {
        const keyCodeToAction = new Map<KeyCode, Actions>();
        const actionInfo = new Map<Actions, ActionInfo>();

        for (const [action, keyCodes] of entries(actionMappings)) {
            for (const keyCode of keyCodes) {
                keyCodeToAction.set(keyCode, action);
            }
            actionInfo.set(action, {
                downEvent: new EventEmitter(),
                upEvent: new EventEmitter(),
                isDown: false,
            });
        }

        this.keyCodeToAction = keyCodeToAction;
        this.actionInfo = actionInfo;

        document.addEventListener("keydown", (event) => {
            const actionInfo = this.getActionInfoForKeyCodeIfExists(event.keyCode);
            if (!actionInfo) {
                return;
            }

            actionInfo.isDown = true;
            actionInfo.downEvent.emit();
        });
        document.addEventListener("keyup", (event) => {
            const actionInfo = this.getActionInfoForKeyCodeIfExists(event.keyCode);
            if (!actionInfo) {
                return;
            }

            actionInfo.isDown = false;
            actionInfo.upEvent.emit();
        });
    }

    isDown(action: Actions): boolean {
        return this.getActionInfo(action).isDown;
    }

    onDown(action: Actions, cb: () => void): Unsubscribe {
        return this.getActionInfo(action).downEvent.listen(cb);
    }

    onUp(action: Actions, cb: () => void): Unsubscribe {
        return this.getActionInfo(action).upEvent.listen(cb);
    }

    private getActionInfoForKeyCodeIfExists(keyCode: number): ActionInfo | null {
        const action = this.keyCodeToAction.get(keyCode);
        if (!action) {
            return null;
        }
        return this.getActionInfo(action);
    }

    private getActionInfo(action: Actions): ActionInfo {
        const actionInfo = this.actionInfo.get(action);
        assert(actionInfo);
        return actionInfo;
    }
}
