import { assertExists } from "@/lib/assert";
import { has } from "@/lib/utils";
import initSlomojs, * as slomojs from "@/slomojs/crate/pkg/slomojs";
import "regenerator-runtime/runtime";

// Chrome does not seem to expose the Animation constructor globally
if (typeof Animation === "undefined") {
    // @ts-expect-error oohhh its all spooky like
    window.Animation = document.body.animate({}).constructor;
}

if (!has(Animation.prototype, "finished")) {
    console.log("add finished polyfill");
    Object.defineProperty(Animation.prototype, "finished", {
        get() {
            if (!this._finished) {
                this._finished =
                    this.playState === "finished"
                        ? Promise.resolve()
                        : new Promise((resolve, reject) => {
                              this.addEventListener("finish", resolve, { once: true });
                              this.addEventListener("cancel", reject, { once: true });
                          });
            }
            return this._finished;
        },
    });
}

const source = `
let a = 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10;
let b = "hello" + " " + "world";
let x = 1 + 2000 + 3 + "hiii", a = 1, b = 2, c;
let y = "hello" + x;
log(y, x, a, b + b + a, log);
let str = "hello, world";
log(str);
__debugScope();
log(__debugScope);
`.trim();

initSlomojs(new URL("./crate/pkg/slomojs_bg.wasm", import.meta.url))
    .then(() => slomojs.start(source, assertExists(document.getElementById("root"))))
    .then((result: unknown) => console.log("success", result))
    .catch((err: unknown) => console.log("error", err));
