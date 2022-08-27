import { assert } from "@/lib/assert";
import { Parser } from "@/lib/objectParser";
import { entries, ObjectMap } from "@/lib/utils";

export function findDataElementParent<Props extends Record<string, string | Parser<unknown>>>(
    element: EventTarget,
    search: Props,
): null | {
    element: HTMLElement;
    data: {
        [K in keyof Props]: Props[K] extends string
            ? Props[K]
            : Props[K] extends Parser<infer P>
            ? P
            : never;
    };
} {
    assert(element instanceof HTMLElement);

    const data: ObjectMap<string, unknown> = {};
    let failed = false;
    for (const [key, value] of entries(search)) {
        const dataValue = element.dataset[key];
        if (typeof value === "string") {
            if (value === dataValue) {
                data[key] = value;
            } else {
                failed = true;
                break;
            }
        } else {
            const parsed = value(dataValue);
            if (parsed.isOk()) {
                data[key] = parsed.value;
            } else {
                failed = true;
                break;
            }
        }
    }

    if (failed) {
        if (element.parentElement) {
            return findDataElementParent(element.parentElement, search);
        }

        return null;
    }

    return {
        element,
        // @ts-expect-error this is fine
        data,
    };
}
