import { entries, ObjectMap } from "@/lib/utils";

export type DebugProps = ObjectMap<string, string | number | boolean | null | undefined>;

export function debugPropsToString(props: DebugProps) {
    return entries(props)
        .filter(([k, v]) => v !== undefined)
        .map(([k, v]) => (k.startsWith("_") ? v : `${k} = ${v}`))
        .join(", ");
}

export function debugStateToString(name: string, props: DebugProps = {}) {
    return `${name}(${debugPropsToString(props)})`;
}
