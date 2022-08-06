import { assert } from "@/lib/assert";
import { Parser } from "@/lib/objectParser";
import { Result } from "@/lib/Result";
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

export async function loadAndParseJson<T>(src: URL, parse: Parser<T>): Promise<T> {
    return parse(await loadJson(src)).unwrap(src.toString());
}
