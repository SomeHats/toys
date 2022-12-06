export function createWindowCanvas(): [
    HTMLCanvasElement,
    {
        width: number;
        height: number;
        scale: number;
    },
] {
    const canvas = document.createElement("canvas");
    const size = {
        width: window.innerWidth,
        height: window.innerHeight,
        scale: window.devicePixelRatio,
    };

    canvas.width = size.width * size.scale;
    canvas.height = size.height * size.scale;
    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;

    window.addEventListener("resize", () => {
        size.width = window.innerWidth;
        size.height = window.innerHeight;
        size.scale = window.devicePixelRatio;

        canvas.width = size.width * size.scale;
        canvas.height = size.height * size.scale;
        canvas.style.width = `${size.width}px`;
        canvas.style.height = `${size.height}px`;
    });

    return [canvas, size];
}
