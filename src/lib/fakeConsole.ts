import { profile } from "console";
import { NoToneMapping } from "three";
import { noop } from "@/lib/utils";

export const fakeConsole: Console = {
    assert: noop,
    clear: noop,
    count: noop,
    countReset: noop,
    debug: noop,
    dir: noop,
    dirxml: noop,
    error: noop,
    group: noop,
    groupCollapsed: noop,
    groupEnd: noop,
    info: noop,
    log: noop,
    table: noop,
    time: noop,
    timeEnd: noop,
    timeLog: noop,
    timeStamp: noop,
    trace: noop,
    warn: noop,
    profile: noop,
    profileEnd: noop,
    Console: console.Console,
};
