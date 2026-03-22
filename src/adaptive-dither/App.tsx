import { DitherPipeline } from "@/adaptive-dither/gpuPipeline";
import type { ProcessingParams } from "@/adaptive-dither/processing";
import {
    DEFAULT_PARAMS,
    adaptiveDitherAsync,
} from "@/adaptive-dither/processing";
import { useCallback, useEffect, useRef, useState } from "react";

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

const GPU_PASSES = new Set<PassName>([
    "original",
    "preprocessed",
    "edges",
    "contrastMap",
]);

const DROP_OFF_FUNCTIONS: ProcessingParams["dropOffFunction"][] = [
    "linear",
    "exponential",
    "quadratic",
    "sine",
];

const DITHER_PATTERNS: ProcessingParams["ditherPattern"][] = [
    "floyd-steinberg",
    "atkinson",
    "ordered",
    "noise",
];

export function App() {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [params, setParams] = useState<ProcessingParams>(DEFAULT_PARAMS);
    const [activePass, setActivePass] = useState<PassName>("dithered");
    const [cpuProgress, setCpuProgress] = useState<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pipelineRef = useRef<DitherPipeline | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scaledWidth =
        image ? Math.round(image.naturalWidth * params.scale) : 0;
    const scaledHeight =
        image ? Math.round(image.naturalHeight * params.scale) : 0;

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
                const maxDim = Math.max(img.naturalWidth, img.naturalHeight);
                if (maxDim > 1000) {
                    updateParam("scale", 1000 / maxDim);
                }
                setImage(img);
                URL.revokeObjectURL(img.src);
            };
            img.src = URL.createObjectURL(file);
        },
        [updateParam],
    );

    // Run GPU passes immediately, schedule CPU dither with debounce
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !image || scaledWidth === 0 || scaledHeight === 0)
            return;

        pipelineRef.current ??= new DitherPipeline(canvas);
        const pipeline = pipelineRef.current;

        pipeline.uploadImage(image, scaledWidth, scaledHeight);
        pipeline.runGpuPasses(params);

        // Display GPU pass immediately if viewing one
        if (GPU_PASSES.has(activePass)) {
            pipeline.displayPass(activePass);
        }

        // Cancel any in-progress CPU work
        abortRef.current?.abort();
        abortRef.current = null;
        setCpuProgress(null);

        // Clear pending debounce
        if (debounceRef.current !== null) {
            clearTimeout(debounceRef.current);
        }

        // Schedule CPU dither pass after debounce
        debounceRef.current = setTimeout(() => {
            debounceRef.current = null;
            const controller = new AbortController();
            abortRef.current = controller;

            const runCpu = async () => {
                const w = pipeline.width;
                const h = pipeline.height;

                try {
                    setCpuProgress(0);

                    // Read GPU results for CPU dithering
                    const preprocessed = pipeline.readPassPixels(
                        DitherPipeline.PASS_PREPROCESSED,
                    );
                    const contrastMap = pipeline.readPassPixels(
                        DitherPipeline.PASS_CONTRAST_MAP,
                    );

                    // Pass 4: Adaptive dither (CPU)
                    const dithered = await adaptiveDitherAsync(
                        preprocessed,
                        contrastMap,
                        w,
                        h,
                        params.maxDitherLevels,
                        params.contrastRangeLow,
                        params.contrastRangeHigh,
                        params.ditherPattern,
                        params.preserveBlocks,
                        {
                            signal: controller.signal,
                            onProgress: (p) => setCpuProgress(p),
                        },
                    );

                    pipeline.uploadBinaryToPass(
                        DitherPipeline.PASS_DITHERED,
                        dithered,
                    );
                    if (activePass === "dithered") {
                        pipeline.displayPass("dithered");
                    }

                    setCpuProgress(null);
                } catch (e) {
                    if (e instanceof DOMException && e.name === "AbortError") {
                        setCpuProgress(null);
                    } else {
                        throw e;
                    }
                }
            };

            void runCpu();
        }, 150);

        return () => {
            abortRef.current?.abort();
            abortRef.current = null;
            if (debounceRef.current !== null) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
            }
        };
    }, [image, scaledWidth, scaledHeight, params, activePass]);

    // Clean up pipeline on unmount
    useEffect(() => {
        return () => {
            pipelineRef.current?.destroy();
            pipelineRef.current = null;
        };
    }, []);

    return (
        <div className="flex h-full">
            {/* Left: Canvas / Image Preview */}
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden bg-stone-200 p-4">
                {!image && (
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
                )}
                {/* Always render the canvas so the WebGL context persists */}
                <div
                    className={
                        image ?
                            "relative flex min-h-0 flex-1 flex-col items-center justify-center gap-2"
                        :   "hidden"
                    }
                >
                    <canvas
                        ref={canvasRef}
                        className="max-h-full max-w-full border border-stone-300"
                        style={{ imageRendering: "pixelated" }}
                    />
                    {cpuProgress !== null && (
                        <div className="absolute bottom-8 left-0 right-0 mx-auto h-1 w-3/4 overflow-hidden rounded-full bg-stone-300">
                            <div
                                className="h-full bg-stone-600 transition-[width] duration-100"
                                style={{
                                    width: `${Math.round(cpuProgress * 100)}%`,
                                }}
                            />
                        </div>
                    )}
                    <p className="shrink-0 text-xs text-stone-400">
                        {scaledWidth} x {scaledHeight}px
                        {cpuProgress !== null ?
                            " — Processing..."
                        :   " — GPU + CPU hybrid"}
                    </p>
                </div>
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
                                        activePass === pass ?
                                            "bg-stone-700 text-stone-100"
                                        :   "bg-stone-200 text-stone-500 hover:bg-stone-300"
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
                        label="Radius"
                        value={params.radius}
                        min={1}
                        max={200}
                        step={1}
                        onChange={(v) => updateParam("radius", v)}
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
                                        params.dropOffFunction === fn ?
                                            "bg-stone-700 text-stone-100"
                                        :   "bg-stone-200 text-stone-500 hover:bg-stone-300"
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
                    <div className="mb-2">
                        <label className="mb-1 block text-xs font-bold text-stone-500">
                            Pattern
                        </label>
                        <div className="flex flex-wrap gap-1">
                            {DITHER_PATTERNS.map((p) => (
                                <button
                                    key={p}
                                    className={`rounded px-2 py-1 text-xs font-bold tracking-wide transition-colors ${
                                        params.ditherPattern === p ?
                                            "bg-stone-700 text-stone-100"
                                        :   "bg-stone-200 text-stone-500 hover:bg-stone-300"
                                    }`}
                                    onClick={() =>
                                        updateParam("ditherPattern", p)
                                    }
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
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
                    <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-stone-500">
                        <input
                            type="checkbox"
                            checked={params.preserveBlocks}
                            onChange={(e) =>
                                updateParam("preserveBlocks", e.target.checked)
                            }
                            className="accent-stone-600"
                        />
                        Preserve Blocks
                    </label>
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
