import { frameLoop } from "@/lib/utils";
import initSim, { create } from "@/sim/crate/pkg/sim";

const PX_SIZE = 4;

async function main() {
    const fontUrl = new URL("./tom-thumb.woff2", import.meta.url);
    const font = await new FontFace(
        "tomThumb",
        `url(${fontUrl.toString()})`,
    ).load();
    (document.fonts as any).add(font);

    await initSim(
        new URL("./crate/pkg/sim_bg.wasm", import.meta.url).toString(),
    );

    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth / PX_SIZE;
    canvas.height = window.innerHeight / PX_SIZE;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    canvas.style.imageRendering = "pixelated";
    canvas.getContext("2d")!.textRendering = "geometricPrecision";
    document.body.appendChild(canvas);

    const app = create(canvas);
    console.log(app);

    frameLoop((dt) => {
        app.update(dt);
        app.draw();
    });
}

main().catch(console.error);
