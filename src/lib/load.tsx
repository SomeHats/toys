import { assert } from "@/lib/assert";
import { Schema } from "@/lib/schema";
import { promiseFromEvents } from "@/lib/utils";

export async function loadImage(src: URL): Promise<HTMLImageElement> {
    const image = new Image();
    const promise = promiseFromEvents(
        (resolve) => image.addEventListener("load", resolve, { once: true }),
        (reject) => image.addEventListener("error", reject, { once: true }),
    );
    image.src = src.toString();
    await promise;
    return image;
}

export async function loadJson(src: URL): Promise<unknown> {
    console.log("url");
    const response = await fetch(src.toString());
    console.log({ src, response });
    assert(response.ok, `${src} OK`);
    return response.json();
}

export async function loadAndParseJson<T>(
    src: URL,
    schema: Schema<T>,
): Promise<T> {
    return schema.parse(await loadJson(src)).unwrap(src.toString());
}
