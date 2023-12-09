import { demo1 } from "@/html2svg/demos";
import { useLocalStorageState } from "@/lib/hooks/useStoredState";
import { Schema } from "@/lib/schema";

const IFRAME_SCRIPT = new URL("./html2svg-iframe.tsx", import.meta.url).toString();

const AppData = Schema.object({
    html: Schema.string,
});

export function Html2SvgApp() {
    const [state, setState] = useLocalStorageState("html2svg", AppData, () => ({ html: demo1 }));

    return (
        <div className="absolute inset-0 flex bg-stone-200 p-3 gap-3">
            <div className="bg-stone-50 rounded-xl flex-1 flex flex-col">
                <div className="px-3 pt-2 font-semibold text-stone-500 flex-none">code</div>
                <textarea
                    value={state.html}
                    onChange={(e) => {
                        const html = e.currentTarget.value;
                        setState((s) => ({ ...s, html }));
                    }}
                    className="flex-auto font-mono p-3 bg-transparent"
                />
            </div>
            <div className="flex-1 flex flex-col gap-3">
                <div className="flex-1 bg-stone-50 rounded-xl flex flex-col">
                    <div className="px-3 pt-2 font-semibold text-stone-500 flex-none">as html</div>
                    <iframe
                        srcDoc={state.html + `<script src="${IFRAME_SCRIPT}"></script>`}
                        className="flex-auto"
                    />
                </div>
                <div className="flex-1 bg-stone-50 rounded-xl">
                    <div className="px-3 pt-2 font-semibold text-stone-500">as svg</div>
                </div>
            </div>
        </div>
    );
}

function injectScript(html: string) {
    html.replace(/(<html>)/);
}
