import {
    DEFAULT_PARAMS,
    adaptiveDither,
    applyBrightnessContrast,
    buildContrastMap,
    detectEdges,
    getScaledGrayscale,
    renderBinary,
    renderGrayscale,
} from "@/adaptive-dither/processing";
import type { ProcessingParams } from "@/adaptive-dither/processing";
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

type PassName =
    | "original"
    | "preprocessed"
    | "edges"
    | "contrastMap"
    | "dithered";

const PASS_LABELS: Record<PassName, string> = {
    original: "Original",
    preprocessed: "1. Preprocessed",
    edges: "2. Edge Detection",
    contrastMap: "3. Contrast Map",
    dithered: "4. Adaptive Dither",
};

const DROP_OFF_FUNCTIONS: ProcessingParams["dropOffFunction"][] = [
    "linear",
    "exponential",
    "quadratic",
    "sine",
];

export function App() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [params, setParams] = useState<ProcessingParams>(DEFAULT_PARAMS);
    const [activePass, setActivePass] = useState<PassName>("dithered");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scaledWidth = image ? Math.round(image.naturalWidth * params.scale) : 0;
    const scaledHeight = image ? Math.round(image.naturalHeight * params.scale) : 0;

    const updateParam = useCallback(
        <K extends keyof ProcessingParams>(
            key: K,
            value: ProcessingParams[K],
        ) => {
            setParams((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    const handleFileUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const img = new Image();
            img.onload = () => {
                setImage(img);
                URL.revokeObjectURL(img.src);
            };
            img.src = URL.createObjectURL(file);
        },
        [],
    );

    // Compute all passes
    const passes = useMemo(() => {
        if (!image || scaledWidth === 0 || scaledHeight === 0) return null;

        const grayscale = getScaledGrayscale(
            image,
            scaledWidth,
            scaledHeight,
        );
        const preprocessed = applyBrightnessContrast(
            grayscale,
            params.brightness,
            params.contrast,
        );
        const edges = detectEdges(
            preprocessed,
            scaledWidth,
            scaledHeight,
            params.edgeStrength,
        );
        const contrastMap = buildContrastMap(
            edges,
            scaledWidth,
            scaledHeight,
            params.dropOffRate,
            params.dropOffFunction,
        );
        const dithered = adaptiveDither(
            preprocessed,
            contrastMap,
            scaledWidth,
            scaledHeight,
            params.maxDitherLevels,
            params.contrastRangeLow,
            params.contrastRangeHigh,
        );

        return { grayscale, preprocessed, edges, contrastMap, dithered };
    }, [image, scaledWidth, scaledHeight, params]);

    // Render active pass to canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !passes) return;

        switch (activePass) {
            case "original":
                renderGrayscale(
                    passes.grayscale,
                    scaledWidth,
                    scaledHeight,
                    canvas,
                );
                break;
            case "preprocessed":
                renderGrayscale(
                    passes.preprocessed,
                    scaledWidth,
                    scaledHeight,
                    canvas,
                );
                break;
            case "edges":
                renderGrayscale(
                    passes.edges,
                    scaledWidth,
                    scaledHeight,
                    canvas,
                );
                break;
            case "contrastMap":
                renderGrayscale(
                    passes.contrastMap,
                    scaledWidth,
                    scaledHeight,
                    canvas,
                );
                break;
            case "dithered":
                renderBinary(
                    passes.dithered,
                    scaledWidth,
                    scaledHeight,
                    canvas,
                );
                break;
        }
    }, [passes, activePass, scaledWidth, scaledHeight]);

    return (
        <div className="flex h-full">
            {/* Left: Canvas / Image Preview */}
            <div className="flex flex-1 flex-col items-center justify-center bg-stone-200 p-4">
                {!image ?
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-lg text-stone-500">
                            Upload an image to get started
                        </p>
                        <button
                            className="rounded bg-stone-700 px-5 py-3 font-bold tracking-wide text-stone-100 transition-transform ease-out-back hover:scale-110 active:scale-95"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose Image
                        </button>
                    </div>
                :   <div className="flex flex-col items-center gap-2">
                        <canvas
                            ref={canvasRef}
                            className="max-h-[80vh] max-w-full border border-stone-300"
                            style={{
                                imageRendering: "pixelated",
                            }}
                        />
                        <p className="text-xs text-stone-400">
                            {scaledWidth} x {scaledHeight}px
                        </p>
                    </div>
                }
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                />
            </div>

            {/* Right: Controls Panel */}
            <div className="flex w-80 shrink-0 flex-col overflow-y-auto border-l border-stone-300 bg-stone-50 p-4">
                <h1 className="mb-4 text-lg font-bold tracking-wide">
                    Adaptive Dither
                </h1>

                {image && (
                    <button
                        className="mb-4 rounded bg-stone-200 px-3 py-1.5 text-sm font-bold tracking-wide text-stone-600 transition-transform ease-out-back hover:scale-105 active:scale-95"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Change Image
                    </button>
                )}

                {/* Pass Selector */}
                <Section title="View Pass">
                    <div className="flex flex-wrap gap-1">
                        {(Object.keys(PASS_LABELS) as PassName[]).map(
                            (pass) => (
                                <button
                                    key={pass}
                                    className={`rounded px-2 py-1 text-xs font-bold tracking-wide transition-colors ${
                                        activePass === pass
                                            ? "bg-stone-700 text-stone-100"
                                            : "bg-stone-200 text-stone-500 hover:bg-stone-300"
                                    }`}
                                    onClick={() => setActivePass(pass)}
                                >
                                    {PASS_LABELS[pass]}
                                </button>
                            ),
                        )}
                    </div>
                </Section>

                {/* Pass 1: Preprocessing */}
                <Section title="1. Preprocessing">
                    <Slider
                        label="Scale"
                        value={params.scale}
                        min={0.05}
                        max={2}
                        step={0.05}
                        onChange={(v) => updateParam("scale", v)}
                        suffix={
                            image ?
                                ` (${scaledWidth}x${scaledHeight})`
                            :   undefined
                        }
                    />
                    <Slider
                        label="Brightness"
                        value={params.brightness}
                        min={-1}
                        max={1}
                        step={0.01}
                        onChange={(v) => updateParam("brightness", v)}
                    />
                    <Slider
                        label="Contrast"
                        value={params.contrast}
                        min={-1}
                        max={1}
                        step={0.01}
                        onChange={(v) => updateParam("contrast", v)}
                    />
                </Section>

                {/* Pass 2: Edge Detection */}
                <Section title="2. Edge Detection">
                    <Slider
                        label="Edge Strength"
                        value={params.edgeStrength}
                        min={0.1}
                        max={5}
                        step={0.1}
                        onChange={(v) => updateParam("edgeStrength", v)}
                    />
                </Section>

                {/* Pass 3: Contrast Map */}
                <Section title="3. Contrast Map">
                    <Slider
                        label="Drop-off Rate"
                        value={params.dropOffRate}
                        min={0.001}
                        max={0.3}
                        step={0.001}
                        onChange={(v) => updateParam("dropOffRate", v)}
                    />
                    <div className="mb-2">
                        <label className="mb-1 block text-xs font-bold text-stone-500">
                            Drop-off Function
                        </label>
                        <div className="flex gap-1">
                            {DROP_OFF_FUNCTIONS.map((fn) => (
                                <button
                                    key={fn}
                                    className={`rounded px-2 py-1 text-xs font-bold tracking-wide transition-colors ${
                                        params.dropOffFunction === fn
                                            ? "bg-stone-700 text-stone-100"
                                            : "bg-stone-200 text-stone-500 hover:bg-stone-300"
                                    }`}
                                    onClick={() =>
                                        updateParam("dropOffFunction", fn)
                                    }
                                >
                                    {fn}
                                </button>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* Pass 4: Adaptive Dithering */}
                <Section title="4. Adaptive Dithering">
                    <Slider
                        label="Resolution Levels"
                        value={params.maxDitherLevels}
                        min={1}
                        max={7}
                        step={1}
                        onChange={(v) => updateParam("maxDitherLevels", v)}
                    />
                    <Slider
                        label="Contrast Range Low"
                        value={params.contrastRangeLow}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(v) => updateParam("contrastRangeLow", v)}
                    />
                    <Slider
                        label="Contrast Range High"
                        value={params.contrastRangeHigh}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={(v) => updateParam("contrastRangeHigh", v)}
                    />
                </Section>
            </div>
        </div>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mb-4 border-b border-stone-200 pb-4">
            <h2 className="mb-2 text-sm font-bold tracking-wide text-stone-600">
                {title}
            </h2>
            {children}
        </div>
    );
}

function Slider({
    label,
    value,
    min,
    max,
    step,
    onChange,
    suffix,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
    suffix?: string;
}) {
    return (
        <div className="mb-2">
            <div className="mb-0.5 flex items-baseline justify-between">
                <label className="text-xs font-bold text-stone-500">
                    {label}
                </label>
                <span className="text-xs text-stone-400">
                    {Number.isInteger(step) ?
                        value
                    :   value.toFixed(step < 0.01 ? 3 : 2)}
                    {suffix}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full accent-stone-600"
            />
        </div>
    );
}
